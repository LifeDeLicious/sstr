//import { formatDistanceToNow } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function AdminCarsCollapse() {
  const queryClient = useQueryClient();
  const [carNames, setCarNames] = useState({});

  const {
    data: carsData,
    isLoading: carsLoading,
    error: carsError,
  } = useQuery({
    queryKey: ["carsData"],
    queryFn: async () => {
      const response = await fetch(
        `https://api.sstr.reinis.space/admin/getcars`,
        {
          credentials: "include",
          method: "GET",
        }
      );

      if (response.status === 401) {
        throw new Error("unauthorized");
      } else if (!response.ok) {
        throw new Error("Failed to fetch tracks");
      }

      return response.json();
    },
    retry: (failureCount, error) => {
      if (error.message === "private") {
        return false;
      }

      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (carsData?.cars) {
      const initialCarNames = {};
      carsData.cars.forEach((car) => {
        initialCarNames[car.carID] = car.carModel || car.carAssetName;
      });
      setCarNames(initialCarNames);
    }
  }, [carsData]);

  console.log("tracksdata", carsData);

  const cars = carsData?.cars || [];

  const handleInputChange = (carID, value) => {
    setTrackNames((prev) => ({
      ...prev,
      [carID]: value,
    }));
  };

  const handleSubmit = async (e, car) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://api.sstr.reinis.space/admin/updatecar`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            carID: car.carID,
            carName: carNames[car.carID],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update car");
      }

      queryClient.invalidateQueries({
        queryKey: ["carsData"],
      });
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  return (
    <>
      <details className="collapse collapse-arrow bg-base-200 border-base-300 border mb-3">
        <summary className="collapse-title font-semibold">
          <div>
            <p className="text-lg">Manage cars</p>
          </div>
        </summary>
        <div className="divider mt-0 mb-0"></div>
        <div className="collapse-content text-sm">
          {tracksLoading ? (
            <div className="flex justify-center p-4">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : tracksError ? (
            <div className="alert alert-error">
              <span>Error loading cars: {carsError.message}</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {cars.map((car) => (
                <form
                  key={car.carID}
                  onSubmit={(e) => handleSubmit(e, car)}
                  className="flex items-center gap-4 mb-4 p-2 bg-base-300 bg-opacity-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <label className="font-semibold whitespace-nowrap">
                      Asset name:
                    </label>
                    <span className="text-md">{car.carAssetName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="font-semibold whitespace-nowrap">
                      Display name:
                    </label>
                    <input
                      type="text"
                      value={trackNames[car.carID] || ""}
                      onChange={(e) =>
                        handleInputChange(car.carID, e.target.value)
                      }
                      className="input input-bordered input-sm min-w-[150px] flex-grow"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-sm btn-primary ml-auto"
                  >
                    Save
                  </button>
                </form>
              ))}
            </div>
          )}
        </div>
      </details>
    </>
  );
}

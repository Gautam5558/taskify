import { getActivitiesByCardId } from "@/lib/actions/activity.action";
import { useEffect, useState } from "react";

export const useFetchActivities = ({ cardId }: { cardId: string }) => {
  const [activities, setAcivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetching() {
      try {
        setLoading(true);
        const { data }: any = await getActivitiesByCardId({ cardId });
        setAcivities(data);
        setLoading(false);
      } catch (err) {
        setError("There was some error");
        console.log(err);
        setLoading(false);
      }
    }
    fetching();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const { data }: any = await getActivitiesByCardId({ cardId });
      setAcivities(data);
      setLoading(false);
    } catch (err) {
      setError("There was some error");
      console.log(err);
      setLoading(false);
    }
  };

  return { activities, error, refetch, loading };
};

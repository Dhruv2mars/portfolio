import { AiActivityHeatmap } from "@/components/ai-activity-heatmap";
import { getAiActivity } from "@/lib/ai-activity";

export async function HomeAiActivity() {
  const activity = await getAiActivity();
  return <AiActivityHeatmap activity={activity} />;
}

import { AiActivityHeatmap } from "@/components/ai-activity-heatmap";
import { getAiActivity } from "@/lib/ai-activity";

export function HomeAiActivity() {
  const activity = getAiActivity();
  return <AiActivityHeatmap activity={activity} />;
}

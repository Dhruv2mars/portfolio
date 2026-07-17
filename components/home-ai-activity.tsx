import { AiActivityHeatmap } from "@/components/ai-activity-heatmap";
import { getAiActivityPayload } from "@/lib/ai-activity-load";

export async function HomeAiActivity() {
  const { payload, source } = await getAiActivityPayload();
  return <AiActivityHeatmap payload={payload} source={source} />;
}

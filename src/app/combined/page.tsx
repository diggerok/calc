import { calculatorConfigs } from "@/lib/calculator-configs";
import CombinedCalculator from "@/components/CombinedCalculator";

async function loadAllPriceData() {
  const data: Record<string, unknown> = {};
  for (const id of Object.keys(calculatorConfigs)) {
    try {
      data[id] = (await import(`@/lib/price-data/${id}.json`)).default;
    } catch {
      // some calcs may not have separate price data
    }
  }
  return data;
}

export default async function CombinedPage() {
  const allPriceData = await loadAllPriceData();
  return <CombinedCalculator allPriceData={allPriceData} />;
}

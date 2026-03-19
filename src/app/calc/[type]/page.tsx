import { notFound } from "next/navigation";
import { calculatorConfigs } from "@/lib/calculator-configs";
import Calculator from "@/components/Calculator";

async function loadPriceData(type: string) {
  try {
    return (await import(`@/lib/price-data/${type}.json`)).default;
  } catch {
    return null;
  }
}

export default async function CalcPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const config = calculatorConfigs[type];
  if (!config) notFound();

  const priceData = await loadPriceData(type);
  if (!priceData) notFound();

  return <Calculator config={config} priceData={priceData} />;
}

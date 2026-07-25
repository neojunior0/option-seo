import { featureSlugs } from './feature-data';
import FeatureDetailContent from './feature-content';

export function generateStaticParams() {
  return featureSlugs.map((slug) => ({ slug }));
}

export default function FeatureDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <FeatureDetailContent slug={params.slug} />;
}

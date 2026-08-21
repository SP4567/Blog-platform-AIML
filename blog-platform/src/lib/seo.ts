export const siteConfig = {
  title: "The Perceptron",
  description: "Autonomous intelligence, machine learning systems, and engineering essays for modern builders.",
  url: "https://theperceptron.dev",
  author: "The Perceptron Editorial Team",
};

export function createMetadata(title: string, description = siteConfig.description) {
  return {
    title: `${title} | ${siteConfig.title}`,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: siteConfig.url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  } as const;
}

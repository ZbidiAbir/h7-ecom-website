interface HeaderSectionProps {
  title: string;
  description?: string;
}

export const HeaderSection = ({ title, description }: HeaderSectionProps) => (
  <div className="text-center mb-12">
    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-4">
      {title}
    </h1>
    {description && (
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
    )}
  </div>
);

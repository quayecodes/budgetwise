type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <p className="font-semibold text-neutral-800">{title}</p>
      <p className="mt-1 text-sm leading-6 text-neutral-600">{description}</p>
    </div>
  );
}
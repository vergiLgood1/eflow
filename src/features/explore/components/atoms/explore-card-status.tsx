interface ExploreCardStatusProps {
  color: string;
}

export function ExploreCardStatus({ color }: ExploreCardStatusProps) {
  return (
    <span
      className="h-2 w-2 shrink-0 rounded-full"
      style={{
        backgroundColor: color,
      }}
    />
  );
}

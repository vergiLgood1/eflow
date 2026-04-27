interface ExploreCardStatusProps {
    color: string;
}

export function ExploreCardStatus({ color }: ExploreCardStatusProps) {
    return (
        <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{
                backgroundColor: color,
            }}
        />
    );
}

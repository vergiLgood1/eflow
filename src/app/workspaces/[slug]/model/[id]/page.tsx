export default async function ModelPage({ params }: { params: { id: string } }) {
    return (
        <div>
            <h1>Model {params.id}</h1>
        </div>
    );
}
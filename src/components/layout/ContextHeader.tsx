interface ContextHeaderProps {
    title: string;
    description: string;
}

export function ContextHeader({ title, description }: ContextHeaderProps) {
    return (
        <div className="border-b border-gray-200 bg-[#F7F6F3] px-8 py-12">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-4 font-serif text-4xl font-bold text-[#111111] leading-tight">
                    {title}
                </h1>
                <p className="max-w-3xl text-lg text-gray-600 leading-relaxed font-sans">
                    {description}
                </p>
            </div>
        </div>
    );
}

import { ContextHeader } from "@/components/layout/ContextHeader";
import { PrimaryWorkspace } from "@/components/layout/PrimaryWorkspace";
import { FileText } from "lucide-react";

export default function ProofPage() {
    return (
        <div className="min-h-screen bg-[#F7F6F3]">
            <ContextHeader
                title="Proof of Work"
                description="Validate your progress and submit evidence."
            />

            <div className="flex flex-1">
                <PrimaryWorkspace>
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 border-2 border-dashed border-gray-200 rounded-lg p-12">
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-serif font-semibold text-[#111111]">Artifact Collection</h3>
                        <p className="text-gray-500 max-w-sm">
                            This space is reserved for collecting proofs and validation steps for your build.
                        </p>
                    </div>
                </PrimaryWorkspace>
            </div>
        </div>
    );
}

import { CheckSquare, Square } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProofItemProps {
    label: string;
    checked: boolean;
    onToggle: () => void;
    proofValue: string;
    onProofChange: (value: string) => void;
    placeholder: string;
}

function ProofItem({ label, checked, onToggle, proofValue, onProofChange, placeholder }: ProofItemProps) {
    return (
        <div className="flex flex-col gap-2 min-w-[200px]">
            <button
                onClick={onToggle}
                className="flex items-center gap-2 text-sm font-medium text-[#111111] hover:text-gray-700 transition-colors"
            >
                {checked ? (
                    <CheckSquare className="h-4 w-4 text-[#8B0000]" />
                ) : (
                    <Square className="h-4 w-4 text-gray-400" />
                )}
                {label}
            </button>

            {checked && (
                <Input
                    value={proofValue}
                    onChange={(e) => onProofChange(e.target.value)}
                    placeholder={placeholder}
                    className="h-8 text-xs bg-white"
                />
            )}
        </div>
    );
}

export function ProofFooter() {
    const [proofs, setProofs] = useState({
        uiBuilt: { checked: false, value: "" },
        logicWorking: { checked: false, value: "" },
        testPassed: { checked: false, value: "" },
        deployed: { checked: false, value: "" },
    });

    const toggle = (key: keyof typeof proofs) => {
        setProofs(prev => ({
            ...prev,
            [key]: { ...prev[key], checked: !prev[key].checked }
        }));
    };

    const updateValue = (key: keyof typeof proofs, value: string) => {
        setProofs(prev => ({
            ...prev,
            [key]: { ...prev[key], value }
        }));
    };

    return (
        <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-8 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
            <div className="mx-auto flex max-w-[1400px] items-start justify-between gap-8">
                <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-[#111111]">Proof of Work</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest px-2 py-0.5 bg-gray-100 rounded">Required</span>
                </div>

                <div className="flex flex-1 items-start justify-end gap-8">
                    <ProofItem
                        label="UI Built"
                        checked={proofs.uiBuilt.checked}
                        onToggle={() => toggle('uiBuilt')}
                        proofValue={proofs.uiBuilt.value}
                        onProofChange={(v) => updateValue('uiBuilt', v)}
                        placeholder="Link to component / screenshot"
                    />
                    <ProofItem
                        label="Logic Working"
                        checked={proofs.logicWorking.checked}
                        onToggle={() => toggle('logicWorking')}
                        proofValue={proofs.logicWorking.value}
                        onProofChange={(v) => updateValue('logicWorking', v)}
                        placeholder="Describe behavior / log"
                    />
                    <ProofItem
                        label="Test Passed"
                        checked={proofs.testPassed.checked}
                        onToggle={() => toggle('testPassed')}
                        proofValue={proofs.testPassed.value}
                        onProofChange={(v) => updateValue('testPassed', v)}
                        placeholder="Test command output"
                    />
                    <ProofItem
                        label="Deployed"
                        checked={proofs.deployed.checked}
                        onToggle={() => toggle('deployed')}
                        proofValue={proofs.deployed.value}
                        onProofChange={(v) => updateValue('deployed', v)}
                        placeholder="Deployment URL"
                    />
                </div>
            </div>
        </footer>
    );
}

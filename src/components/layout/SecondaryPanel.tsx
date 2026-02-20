import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Terminal, Play, AlertCircle, ImagePlus } from "lucide-react";

interface SecondaryPanelProps {
    stepExplanation: string;
    prompt: string;
}

export function SecondaryPanel({ stepExplanation, prompt }: SecondaryPanelProps) {
    return (
        <aside className="w-[30%] border-l border-gray-200 bg-[#F7F6F3] p-6 hidden lg:block overflow-y-auto min-h-[calc(100vh-140px)]">
            <div className="space-y-6 sticky top-6">
                <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#111111]">
                        Step Guide
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {stepExplanation}
                    </p>
                </div>

                <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-sans font-medium text-gray-500 uppercase tracking-wider">
                            Prompt
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-sm font-mono text-gray-700 break-words whitespace-pre-wrap">
                            {prompt}
                        </div>

                        <Button className="w-full gap-2" variant="outline">
                            <Copy className="h-4 w-4" />
                            Copy Prompt
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Actions
                    </h4>

                    <div className="grid grid-cols-1 gap-2">
                        <Button className="w-full justify-start gap-2 bg-[#8B0000] hover:bg-[#8B0000]/90 text-white">
                            <Terminal className="h-4 w-4" />
                            Build in Lovable
                        </Button>

                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="justify-start gap-2 text-green-700 bg-green-50 hover:bg-green-100 hover:text-green-800 border-green-200">
                                <Play className="h-4 w-4" />
                                It Worked
                            </Button>
                            <Button variant="outline" className="justify-start gap-2 text-amber-700 bg-amber-50 hover:bg-amber-100 hover:text-amber-800 border-amber-200">
                                <AlertCircle className="h-4 w-4" />
                                Error
                            </Button>
                        </div>

                        <Button variant="outline" className="justify-start gap-2">
                            <ImagePlus className="h-4 w-4" />
                            Add Screenshot
                        </Button>
                    </div>
                </div>
            </div>
        </aside>
    );
}

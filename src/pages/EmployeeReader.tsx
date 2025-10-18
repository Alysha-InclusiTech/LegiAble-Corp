import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Upload, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EmployeeReader = () => {
  const [text, setText] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [isRulerEnabled, setIsRulerEnabled] = useState(true);
  const [rulerPosition, setRulerPosition] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload an image or PDF file",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    toast({
      title: `Processing ${file.type === 'application/pdf' ? 'PDF' : 'image'}...`,
      description: "Extracting text with AI-powered OCR",
    });

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;

        // Call OCR edge function with file type info
        const { data, error } = await supabase.functions.invoke('ocr-extract', {
          body: { 
            image: base64Data,
            mimeType: file.type
          }
        });

        if (error) {
          throw error;
        }

        if (data?.text) {
          setExtractedText(data.text);
          toast({
            title: "Success!",
            description: "Text extracted successfully",
          });
        } else {
          throw new Error('No text extracted from image');
        }

        setIsProcessing(false);
      };

      reader.onerror = () => {
        throw new Error('Failed to read file');
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('OCR error:', error);
      setIsProcessing(false);
      toast({
        title: "Extraction failed",
        description: error instanceof Error ? error.message : "Failed to extract text from image",
        variant: "destructive",
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isRulerEnabled) {
      const rect = e.currentTarget.getBoundingClientRect();
      setRulerPosition(e.clientY - rect.top);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">LegiAble Reader</h1>
          <p className="text-muted-foreground">Upload a document or paste text to read with enhanced accessibility</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Input</h2>
            
            <div className="mb-6">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload an image or PDF document</p>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </Label>
            </div>

            <div className="mb-4">
              <Label htmlFor="text-input">Or paste your text here:</Label>
              <Textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here..."
                className="min-h-[200px] mt-2"
              />
            </div>

            <Button 
              onClick={() => setExtractedText(text)}
              disabled={!text || isProcessing}
              className="w-full"
            >
              Display with Accessible Font
            </Button>
          </Card>

          {/* Reader Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Reader View</h2>
              <div className="flex items-center gap-2">
                <Switch
                  id="ruler-mode"
                  checked={isRulerEnabled}
                  onCheckedChange={setIsRulerEnabled}
                />
                <Label htmlFor="ruler-mode" className="cursor-pointer flex items-center gap-1">
                  {isRulerEnabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  Reading Ruler
                </Label>
              </div>
            </div>

            <div 
              className="relative bg-reader-bg rounded-lg p-6 min-h-[400px] overflow-hidden font-dyslexic"
              onMouseMove={handleMouseMove}
            >
              {isRulerEnabled && extractedText && (
                <>
                  {/* Blur overlay above ruler */}
                  <div
                    className="absolute left-0 right-0 top-0 bg-reader-bg/60 backdrop-blur-sm pointer-events-none transition-all duration-100 z-20"
                    style={{ height: `${rulerPosition - 24}px` }}
                  />
                  
                  {/* Reading ruler highlight */}
                  <div
                    className="absolute left-0 right-0 h-12 bg-focus-highlight/20 pointer-events-none transition-all duration-100 border-y-2 border-focus-highlight z-10"
                    style={{ top: `${rulerPosition - 24}px` }}
                  />
                  
                  {/* Blur overlay below ruler */}
                  <div
                    className="absolute left-0 right-0 bottom-0 bg-reader-bg/60 backdrop-blur-sm pointer-events-none transition-all duration-100 z-20"
                    style={{ top: `${rulerPosition + 24}px` }}
                  />
                </>
              )}
              
              {extractedText ? (
                <p className="text-xl leading-relaxed relative z-10 whitespace-pre-wrap">
                  {extractedText}
                </p>
              ) : (
                <p className="text-muted-foreground text-center mt-20">
                  Upload a document or paste text to begin reading
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeReader;

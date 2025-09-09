import React from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, EyeClosed, EyeClosedIcon, EyeOff, KeyIcon, Settings } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Link from "next/link";
import { useAtom } from "jotai";
import { apiKeyAtom, authAtom } from "@/app/store";
import { createApiKey } from "@/lib/users";

const Setting = () => {
    const [authData,] = useAtom(authAtom)
    const [apiKey, setApiKey] = useAtom(apiKeyAtom);
    const [status, setStatus] = React.useState<"idle" | "testing" | "success" | "error">("idle");
    const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "success" | "error">("idle");
     const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    const handleTestKey = async () => {
        if (!apiKey) {
            setStatus("error");
            return;
        }

        setStatus("testing");

        try {
            // Example: Test API call (replace with your real endpoint)
            const res = await fetch(`/api/test-key?key=${apiKey}`);

            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch (err) {
            console.log(err)
            setStatus("error");
        } finally {
            setTimeout(() => {
                setStatus("idle")
            }, 2000);
        }
    };

    const handleSaveKey = async (formData: FormData) => {
        setSaveStatus('saving')
        try {
            // Example: Test API call (replace with your real endpoint)
            const res = await fetch(`/api/test-key?key=${apiKey}&email=${authData.user.email}`, { method: "POST" });

            if (res.ok) {
                setSaveStatus("success");
            } else {
                setSaveStatus("error");
            }
        } catch (err) {
            console.log(err)
            setSaveStatus("error");
        } finally {
            setTimeout(() => {
                setSaveStatus("idle")
            }, 2000);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"icon"}>
                    <Settings />
                </Button>
            </DialogTrigger>
            <DialogContent>
            <form action={handleSaveKey} className="sm:max-w-md flex flex-col gap-3">
                <DialogHeader className="text-left">
                    <DialogTitle>
                        <KeyIcon className="inline mx-1" />
                        API Key
                    </DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
                <Label htmlFor="apikey" className="sr-only">
                    API Key
                </Label>
                <div className="relative"> {/* Make the parent element relative */}
                    <Input
                        id="apikey"
                        value={apiKey}
                        name="key"
                        onChange={(e) => setApiKey(e.target.value)}
                        type={isVisible ? 'text' : 'password'} // Toggle input type
                        placeholder="Enter your API key"
                        className="pr-1 text-xs" // Add padding to prevent icon overlap
                    />
                    <button
                        type="button"
                        onClick={toggleVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 bg-transparent" // Position the icon
                    >
                        {!isVisible ? <EyeOff className="text-gray-500"/> : <Eye className="text-gray-500"/>} {/* Toggle between icons */}
                    </button>
                </div>
            </div>
        </div>

                <DialogDescription>
                    Need an API key?
                    Get your free Gemini API key from
                    <Link
                        href="https://aistudio.google.com/app/apikey"
                        target="blank"
                        className="text-blue-500 underline ml-2"
                    >
                        Google AI Studio
                    </Link>
                </DialogDescription>

                <DialogFooter>
                    <Button type="submit" variant="default">
                        {saveStatus === "saving" ? "Saving..." : "Save"}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleTestKey}
                        disabled={status === "testing"}
                    >
                        {status === "testing" ? "Testing..." : "Test API Key"}
                    </Button>
                </DialogFooter>

                {status === "success" && (
                    <p className="text-green-600 text-sm mt-2">✅ API Key works!</p>
                )}
                {status === "error" && (
                    <p className="text-red-600 text-sm mt-2">❌ Invalid API Key.</p>
                )}
                {saveStatus === "success" && (
                    <p className="text-green-600 text-sm mt-2">✅ API Key saved!</p>
                )}
                {saveStatus === "error" && (
                    <p className="text-red-600 text-sm mt-2">❌ Error in Saving API Key.</p>
                )}
            </form> 
            </DialogContent>
        </Dialog>
    );
};

export default Setting;
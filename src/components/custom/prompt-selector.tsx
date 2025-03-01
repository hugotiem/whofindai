'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { promptStorage, StoredPrompt } from '@/lib/services/prompt-storage';
import { Plus, Trash2 } from 'lucide-react';

interface PromptSelectorProps {
  onSelectPrompt: (prompt: string) => void;
}

export function PromptSelector({ onSelectPrompt }: PromptSelectorProps) {
  const [prompts, setPrompts] = useState<StoredPrompt[]>([]);
  const [selectedPromptId, setSelectedPromptId] = useState<string>('');
  const [newPromptName, setNewPromptName] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    // Load prompts from storage
    const storedPrompts = promptStorage.getAllPrompts();
    setPrompts(storedPrompts);

    // If there are prompts, select the first one
    if (storedPrompts.length > 0) {
      setSelectedPromptId(storedPrompts[0].id);
      onSelectPrompt(storedPrompts[0].prompt);
    }
  }, [onSelectPrompt]);

  const handleSelectPrompt = (id: string) => {
    setSelectedPromptId(id);
    const selectedPrompt = prompts.find((p) => p.id === id);
    if (selectedPrompt) {
      onSelectPrompt(selectedPrompt.prompt);
    }
  };

  const handleSaveNewPrompt = (currentPrompt: string) => {
    if (!newPromptName.trim()) {
      alert('Please enter a name for your prompt');
      return;
    }

    const newPrompt = promptStorage.savePrompt(newPromptName, currentPrompt);
    setPrompts([...prompts, newPrompt]);
    setSelectedPromptId(newPrompt.id);
    setNewPromptName('');
    setIsDialogOpen(false);
  };

  const handleDeletePrompt = (id: string) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      const success = promptStorage.deletePrompt(id);
      if (success) {
        const updatedPrompts = prompts.filter((p) => p.id !== id);
        setPrompts(updatedPrompts);

        // If we deleted the selected prompt, select another one if available
        if (id === selectedPromptId && updatedPrompts.length > 0) {
          setSelectedPromptId(updatedPrompts[0].id);
          onSelectPrompt(updatedPrompts[0].prompt);
        } else if (updatedPrompts.length === 0) {
          setSelectedPromptId('');
          onSelectPrompt('');
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Prompts</CardTitle>
        <CardDescription>
          Select a saved prompt or create a new one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Select value={selectedPromptId} onValueChange={handleSelectPrompt}>
              <SelectTrigger>
                <SelectValue placeholder="Select a prompt" />
              </SelectTrigger>
              <SelectContent>
                {prompts.map((prompt) => (
                  <SelectItem key={prompt.id} value={prompt.id}>
                    {prompt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save New Prompt</DialogTitle>
                <DialogDescription>
                  Give your prompt a name to save it for future use
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="promptName">Prompt Name</Label>
                  <Input
                    id="promptName"
                    placeholder="My Custom Prompt"
                    value={newPromptName}
                    onChange={(e) => setNewPromptName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // We'll pass the current prompt from the parent component
                    const currentPromptTextarea = document.getElementById(
                      'finalPrompt'
                    ) as HTMLTextAreaElement;
                    if (currentPromptTextarea) {
                      handleSaveNewPrompt(currentPromptTextarea.value);
                    }
                  }}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {selectedPromptId && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDeletePrompt(selectedPromptId)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

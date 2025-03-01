'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CORE_REQUIREMENTS,
  SECTION_REQUIREMENTS,
  OUTPUT_REQUIREMENTS
} from '@/lib/prompts/profile/instructions';
import { TEMPLATES } from '@/lib/prompts/profile/templates';

export interface PromptEditorProps {
  initialPrompt?: string;
  onPromptChange: (prompt: string) => void;
  onSave: (prompt: string) => void;
}

// Define explicit mutable types
interface SectionRequirement {
  description: string;
  requirements: string[];
}

interface MutableSectionRequirements {
  professionalOverview: SectionRequirement;
  companyOverview: SectionRequirement;
  engagementStrategy: SectionRequirement;
}

interface MutableCoreRequirements {
  researchIntegration: string;
  actionability: string;
  professionalism: string;
  validation: string;
}

export function PromptEditor({
  initialPrompt,
  onPromptChange,
  onSave
}: PromptEditorProps) {
  const [systemMessage, setSystemMessage] = useState<string>('');

  // Initialize with a deep copy that removes the readonly constraints
  const [sectionRequirements, setSectionRequirements] =
    useState<MutableSectionRequirements>(() => {
      return {
        professionalOverview: {
          description: SECTION_REQUIREMENTS.professionalOverview.description,
          requirements: [
            ...SECTION_REQUIREMENTS.professionalOverview.requirements
          ]
        },
        companyOverview: {
          description: SECTION_REQUIREMENTS.companyOverview.description,
          requirements: [...SECTION_REQUIREMENTS.companyOverview.requirements]
        },
        engagementStrategy: {
          description: SECTION_REQUIREMENTS.engagementStrategy.description,
          requirements: [
            ...SECTION_REQUIREMENTS.engagementStrategy.requirements
          ]
        }
      };
    });

  // Initialize with a deep copy that removes the readonly constraints
  const [coreRequirements, setCoreRequirements] =
    useState<MutableCoreRequirements>(() => {
      return {
        researchIntegration: CORE_REQUIREMENTS.researchIntegration,
        actionability: CORE_REQUIREMENTS.actionability,
        professionalism: CORE_REQUIREMENTS.professionalism,
        validation: CORE_REQUIREMENTS.validation
      };
    });

  const [outputRequirements, setOutputRequirements] = useState<string[]>([
    ...OUTPUT_REQUIREMENTS
  ]);
  const [language, setLanguage] = useState<string>('english');
  const [finalPrompt, setFinalPrompt] = useState<string>(initialPrompt || '');

  // Wrap buildPrompt in useCallback to prevent recreation on every render
  const buildPrompt = useCallback(() => {
    const prompt = [
      systemMessage,
      '\nSection Requirements:',
      Object.entries(sectionRequirements)
        .map(
          ([section, { description, requirements }]) =>
            `${section}:\n${description}\n- ${requirements.join('\n- ')}`
        )
        .join('\n\n'),
      '\nCore Requirements:',
      Object.entries(coreRequirements)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n'),
      '\nOutput Format:',
      JSON.stringify(
        {
          format: TEMPLATES.RESPONSE_FORMAT,
          formatting: TEMPLATES.FORMATTING_GUIDELINES,
          analysis: TEMPLATES.ANALYSIS_CATEGORIES
        },
        null,
        2
      ),
      '\nOutput Rules:',
      outputRequirements.join('\n'),
      `\nLanguage: ${language}`
    ].join('\n');

    setFinalPrompt(prompt);
    onPromptChange(prompt);
  }, [
    systemMessage,
    sectionRequirements,
    coreRequirements,
    outputRequirements,
    language,
    onPromptChange
  ]);

  const handleSectionRequirementChange = (
    section: keyof MutableSectionRequirements,
    field: 'description' | 'requirements',
    value: string | string[],
    index?: number
  ) => {
    setSectionRequirements((prev) => {
      // Create a deep copy to avoid mutating the original state
      const updated = { ...prev };

      if (field === 'description') {
        // Update the description field
        updated[section] = {
          ...updated[section],
          description: value as string
        };
      } else if (field === 'requirements' && typeof index === 'number') {
        // Update a specific requirement at the given index
        const updatedRequirements = [...updated[section].requirements];
        updatedRequirements[index] = value as string;

        updated[section] = {
          ...updated[section],
          requirements: updatedRequirements
        };
      }

      return updated;
    });
  };

  // Initialize with default values
  useEffect(() => {
    setSystemMessage(
      "AI sales assistant generating comprehensive LinkedIn prospect profiles. Create detailed insights and engagement strategies based on the prospect's profile data and the product/service being sold. Focus on actionable sales intelligence and strategic conversation starters."
    );

    if (initialPrompt) {
      setFinalPrompt(initialPrompt);
    } else {
      buildPrompt();
    }
  }, [initialPrompt, buildPrompt]);

  const handleCoreRequirementChange = (
    key: keyof MutableCoreRequirements,
    value: string
  ) => {
    setCoreRequirements((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleOutputRequirementChange = (index: number, value: string) => {
    setOutputRequirements((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSave = () => {
    buildPrompt();
    onSave(finalPrompt);
  };

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Prompt Editor</CardTitle>
          <CardDescription>
            Customize the profile generation prompt to get better results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="system">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="system">System Message</TabsTrigger>
              <TabsTrigger value="sections">Section Requirements</TabsTrigger>
              <TabsTrigger value="core">Core Requirements</TabsTrigger>
              <TabsTrigger value="output">Output Requirements</TabsTrigger>
            </TabsList>

            <TabsContent value="system" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="systemMessage">System Message</Label>
                <Textarea
                  id="systemMessage"
                  value={systemMessage}
                  onChange={(e) => setSystemMessage(e.target.value)}
                  rows={5}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent value="sections" className="space-y-6">
              {Object.entries(sectionRequirements).map(
                ([section, { description, requirements }]) => (
                  <div
                    key={section}
                    className="space-y-4 border p-4 rounded-md"
                  >
                    <h3 className="text-lg font-semibold">{section}</h3>

                    <div className="space-y-2">
                      <Label htmlFor={`${section}-description`}>
                        Description
                      </Label>
                      <Textarea
                        id={`${section}-description`}
                        value={description}
                        onChange={(e) =>
                          handleSectionRequirementChange(
                            section as keyof MutableSectionRequirements,
                            'description',
                            e.target.value
                          )
                        }
                        rows={2}
                        className="font-mono text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Requirements</Label>
                      {requirements.map(
                        (requirement: string, index: number) => (
                          <div key={index} className="flex gap-2 items-start">
                            <Textarea
                              value={requirement}
                              onChange={(e) =>
                                handleSectionRequirementChange(
                                  section as keyof MutableSectionRequirements,
                                  'requirements',
                                  e.target.value,
                                  index
                                )
                              }
                              rows={2}
                              className="font-mono text-sm"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </TabsContent>

            <TabsContent value="core" className="space-y-4">
              {Object.entries(coreRequirements).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={`core-${key}`}>{key}</Label>
                  <Textarea
                    id={`core-${key}`}
                    value={value}
                    onChange={(e) =>
                      handleCoreRequirementChange(
                        key as keyof MutableCoreRequirements,
                        e.target.value
                      )
                    }
                    rows={2}
                    className="font-mono text-sm"
                  />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="output" className="space-y-4">
              {outputRequirements.map((requirement, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`output-${index}`}>
                    Requirement {index + 1}
                  </Label>
                  <Textarea
                    id={`output-${index}`}
                    value={requirement}
                    onChange={(e) =>
                      handleOutputRequirementChange(index, e.target.value)
                    }
                    rows={2}
                    className="font-mono text-sm"
                  />
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => buildPrompt()}>
            Preview
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Final Prompt</CardTitle>
          <CardDescription>
            This is the complete prompt that will be sent to the AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="finalPrompt"
            value={finalPrompt}
            onChange={(e) => {
              setFinalPrompt(e.target.value);
              onPromptChange(e.target.value);
            }}
            rows={10}
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>
    </div>
  );
}

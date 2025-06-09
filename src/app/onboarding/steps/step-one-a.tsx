'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { User } from 'lucide-react';
import { OnboardingData } from '../page';

interface StepOneAProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
}

export default function StepOneA({ data, updateData }: StepOneAProps) {
  const jobRoles = ['SDR', 'AE', 'Sales Manager', 'RevOps', 'Other'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Who are you?</h1>
        <p className="text-muted-foreground text-lg">
          Let&apos;s start with some basic information about yourself
        </p>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Personal Information</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => updateData({ firstName: e.target.value })}
              placeholder="Enter your first name"
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => updateData({ lastName: e.target.value })}
              placeholder="Enter your last name"
              className="h-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobRole">Job role</Label>
          <Select
            value={data.jobRole}
            onValueChange={(value) => updateData({ jobRole: value })}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {jobRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

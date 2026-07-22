'use client';

import {
  ApplicationStep1Input,
  applicationStep1Schema,
} from '@/lib/validation/schema';
import { submitVolunteerApplicationServices } from '@/services/application.service';
import { uploadFileServices } from '@/services/upload.service';
import { SingleDocKey, UploadedDocs } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
}

const MAX_MULTI_FILES = 5;

export const useVolunteerSubmitApplication = ({
  firstName,
  lastName,
  email,
}: Props) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingKeys, setUploadingKeys] = useState<Set<string>>(new Set());
  const [docs, setDocs] = useState<UploadedDocs>({
    trainingCertUrls: [],
    medicalCertUrls: [],
  });

  const [step1Data, setStep1Data] = useState<ApplicationStep1Input | null>(
    null,
  );

  const [certified, setCertified] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationStep1Input>({
    resolver: zodResolver(applicationStep1Schema),
    defaultValues: {
      gender: 'Male',
      maritalStatus: 'Single',
      nationality: 'Filipino',
      firstName: firstName,
      lastName: lastName,
      email: email,
    },
  });

  const uploadFile = async (
    file: File,
    type: string,
  ): Promise<string | null> => {
    try {
      const res = await uploadFileServices(file, type);
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? `Failed to upload ${file.name}`);
        return null;
      }

      return json.url as string;
    } catch {
      toast.error(`Failed to upload ${file.name}. Please try again.`);
      return null;
    }
  };

  const setUploading = (key: string, value: boolean) => {
    setUploadingKeys((prev) => {
      const next = new Set(prev);
      if (value) {
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docKey: SingleDocKey,
    uploadType: string,
    successLabel = 'Document',
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploading(uploadType, true);
    const url = await uploadFile(file, uploadType);
    setUploading(uploadType, false);

    if (url) {
      setDocs((prev) => ({ ...prev, [docKey]: url }));
      toast.success(`${successLabel} uploaded!`);
    }
  };

  const handleMultiFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docKey: 'trainingCertUrls' | 'medicalCertUrls',
    uploadType: string,
  ) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

    const remainingSlots = MAX_MULTI_FILES - docs[docKey].length;
    if (remainingSlots <= 0) {
      toast.error(`You can upload up to ${MAX_MULTI_FILES} files.`);
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    if (files.length > filesToUpload.length) {
      toast.error(
        `Only ${remainingSlots} more file${remainingSlots > 1 ? 's' : ''} can be added (max ${MAX_MULTI_FILES}).`,
      );
    }

    setUploading(uploadType, true);
    const results = await Promise.all(
      filesToUpload.map((file) => uploadFile(file, uploadType)),
    );
    setUploading(uploadType, false);

    const newUrls = results.filter((u): u is string => Boolean(u));
    if (newUrls.length > 0) {
      setDocs((prev) => ({
        ...prev,
        [docKey]: [...prev[docKey], ...newUrls],
      }));
      toast.success(
        `${newUrls.length} file${newUrls.length > 1 ? 's' : ''} uploaded!`,
      );
    }
  };

  const removeMultiFile = (
    docKey: 'trainingCertUrls' | 'medicalCertUrls',
    url: string,
  ) => {
    setDocs((prev) => ({
      ...prev,
      [docKey]: prev[docKey].filter((u) => u !== url),
    }));
  };

  const getMissingDocumentMessage = (): string | null => {
    if (!docs.photoUrl) return 'Please upload your profile photo first.';
    if (!docs.validIdFrontUrl || !docs.validIdBackUrl)
      return 'Please upload both sides of your Valid ID first.';
    if (docs.trainingCertUrls.length === 0)
      return 'Please upload at least one training certificate first.';
    if (!docs.barangayClearanceUrl)
      return 'Please upload your Barangay Clearance first.';
    if (docs.medicalCertUrls.length === 0)
      return 'Please upload at least one medical certificate first.';
    return null;
  };

  const onStep1Submit = (data: ApplicationStep1Input) => {
    setStep1Data(data);
    console.log(data);
    setStep(2);
  };

  const onFinalSubmit = async () => {
    if (!step1Data) return;
    const missingDocMessage = getMissingDocumentMessage();
    if (missingDocMessage) {
      toast.error(missingDocMessage);
      setStep(2);
      return;
    }
    if (!certified) {
      toast.error('Please certify that your information is true and correct.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitVolunteerApplicationServices({
        ...step1Data,
        ...docs,
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? 'Submission failed');
        return;
      }

      toast.success('Application submitted successfully!');
      router.push('/profile');
      router.refresh();
    } catch {
      toast.error('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    docs,
    step,
    setStep,
    step1Data,
    isSubmitting,
    uploadingKeys,
    certified,
    setCertified,
    register,
    handleSubmit,
    errors,
    handleFileChange,
    handleMultiFileChange,
    removeMultiFile,
    onStep1Submit,
    onFinalSubmit,
    MAX_MULTI_FILES,
    getMissingDocumentMessage,
  };
};

export default useVolunteerSubmitApplication;

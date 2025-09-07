import { logger } from '@/lib/logger'
import { atom, useAtom } from 'jotai'
import { atomWithInfiniteQuery, atomWithQuery, atomWithMutation } from 'jotai-tanstack-query'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { toast } from 'sonner'

const voiceNoteAtom = atomWithQuery((get) => {
  const email = get(emailAtom);  // Ensure you're extracting the email properly
  console.log('email in voiceNoteAtom', email)
  const category = get(selectedCategoryAtom);
  console.log('Fetching with email:', email, 'and category:', category); // Debug output

  return {
    queryKey: ['voice-notes', email.email, category],
    queryFn: async () => {
      if (!email) {
        throw new Error("Email is not defined");
      }
      const res = await fetch(`/api/notes?email=${email.email}&category=${category}`);
      if (!res.ok) {
        throw new Error("Failed to fetch notes");
      }
      return res.json();
    },
  };
});
// Assuming you have the type defined earlier
export type SubmittedDataType = {
  burmese: string;
  english: string;
  context: string;
  audioUrl: string;
  email: string;
  editedText?: string;
  category: string | null;
};

const mutateVoiceNoteAtom = atomWithMutation(() => {
  return ({
    mutationKey: ['voice-notes'],
    mutationFn: async ({ data }: { data: SubmittedDataType }) => {
      console.log('data in mutation', data)
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Ensure finalData is the data you're sending
      });

      if (!res.ok) {
        throw new Error('Failed to save voice note');
      }

      const result = await res.json();
      return result;
    },
  })
});


const selectedLanguageAtom = atom<string | undefined>(undefined);
const selectedDurationAtom = atom<string | undefined>(undefined);
export interface TranscribedData {
  _id?: string;
  burmese: string;
  english: string;
  context: string;
  audioUrl: string;
  email: string;
  editedText?: string;
  category: string | null;
}
const transcribedContent = {
  burmese: "",
  english: "",
  context: "",
  editedText: "",
  category: "",
  audioUrl: "",
  email: ""
}

const submittedContent = {
  burmese: "",
  english: "",
  context: "",
  editedText: "",
  category: "",
  audioUrl: "",
  email: ""
}
const session_storage = createJSONStorage<TranscribedData>(
  // getStringStorage
  () => sessionStorage, // or sessionStorage, asyncStorage or alike
  // // options (optional)
  // {
  //   reviver, // optional reviver option for JSON.parse
  //   replacer, // optional replacer option for JSON.stringify
  // },
)
export interface EmailData {
  email: string;
}
const email_storage = createJSONStorage<EmailData>(
  () => sessionStorage,
)
const emailContent = { email: "" }
const emailAtom = atomWithStorage<EmailData>('user-email', emailContent, email_storage)
const transcribedAtom = atomWithStorage('transcribed-data', transcribedContent, session_storage)
const selectedCategoryAtom = atom<string>(""); // Initialize with null or a default value
const submittedDataAtom = atomWithStorage('submitted-data', submittedContent, session_storage) // Initialize with null or a default value

export const submitDataAtom = atom(async (get) => {
  const transcribedData = get(transcribedAtom);
  const selectedCategory = get(selectedCategoryAtom);

  logger.info({
    ...transcribedData,
    category: selectedCategory,
  })
  if (!transcribedData || !selectedCategory) {
    toast.warning("Cannot submit data without transcribed data and category.");
    return;
  }

  const response = await fetch('/api/voice', { // Replace with your actual endpoint
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...transcribedData,
      category: selectedCategory,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save data');
  }

  const data = await response.json();
  return {
    ...transcribedData,
    category: selectedCategory,
    ...data,
  };
});


export { useAtom, voiceNoteAtom, selectedDurationAtom, selectedLanguageAtom, transcribedAtom, selectedCategoryAtom, submittedDataAtom, mutateVoiceNoteAtom, emailAtom }
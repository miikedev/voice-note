import { logger } from '@/lib/logger'
import { useQueryClient } from '@tanstack/react-query'
import { atom, useAtom } from 'jotai'
import { atomWithQuery, atomWithMutation } from 'jotai-tanstack-query'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { ISODateString } from 'next-auth';
import { toast } from 'sonner'

// Define the User type
interface User {
  name: string | undefined;
  email: string;
  image: string;
}

// Define the Auth type
export interface Auth {
  user: User;
  expires: ISODateString; // Date is typically represented as a string in ISO format
}

const initialAuth: Auth = {
  user: {
    name: "",
    email: "",
    image: "",
  },
  expires: "",
};

// Use the initial value as the initial state
const emailContent: Auth = initialAuth;

// toggle atom for data descending and ascending
const toggleAtom = atom(false);

const apiKeyAtom = atom<string>("");

const voiceNoteAtom = atomWithQuery((get) => {
  const auth = get(authAtom);
  const category = get(selectedCategoryAtom);
  const isDescending = get(toggleAtom); // Get the toggle state for sorting

  console.log('email in voiceNoteAtom:', auth);
  console.log('Fetching with email:', auth.user.email, 'and category:', category, 'Descending:', isDescending); // Debug output

  return {
    queryKey: ['voice-notes', auth.user.email, category ?? 'all', isDescending], // Add isDescending to queryKey
    queryFn: async () => {
      if (!auth.user.email) {
        throw new Error("Email is not defined");
      }

      // You might want to make additional changes on the server side to handle sort order
      const res = await fetch(`/api/notes?email=${auth.user.email}&category=${category}&order=${isDescending ? 'desc' : 'asc'}`); // Pass sort order as query param 

      if (!res.ok) {
        throw new Error("Failed to fetch notes");
      }
      return res.json();
    },
  };
});
// Assuming you have the type defined earlier
export type SubmittedDataType = {
  english: string | undefined;
  context: string | undefined | null;
  audioUrl: string | undefined;
  email: string | undefined;
  transcribedText: string | undefined;
  category: string | null | undefined;
  lang: string | undefined,
  duration: number | undefined
};

const mutateVoiceNoteAtom = atomWithMutation(get => {
  const auth = get(authAtom);
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
    onSuccess: async () => {
      //  
    }
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
  english: "",
  context: "",
  audioUrl: "",
  email: "",
  transcribedText: "",
  category: "",
  lang: "",
  duration: undefined,
}
export type noteData = {
  _id?: string;
  english: string;
  context: string;
  audioUrl: string;
  email: string;
  transcribedText?: string;
  category: string | null;
  lang: string;
  duration: undefined | string;
}
const transcribed_storage = createJSONStorage<TranscribedData>(
  // getStringStorage
  () => sessionStorage, // or sessionStorage, asyncStorage or alike
  // // options (optional)
  // {
  //   reviver, // optional reviver option for JSON.parse
  //   replacer, // optional replacer option for JSON.stringify
  // },
)
const submitted_storage = createJSONStorage<SubmittedDataType>(
  () => sessionStorage,
)

const auth_storage = createJSONStorage<Auth>(
  () => sessionStorage,
)

const authAtom = atomWithStorage<Auth>('user-email', emailContent, auth_storage)
const transcribedAtom = atomWithStorage<TranscribedData>('transcribed-data', transcribedContent, transcribed_storage)
const selectedCategoryAtom = atom<string>(""); // Initialize with null or a default value
const submittedDataAtom = atomWithStorage<SubmittedDataType>('submitted-data', submittedContent, submitted_storage) // Initialize with null or a default value

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

  const response = await fetch('/api/voice', {
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

const usersAtom = atomWithQuery((get) => {
  return ({
    queryKey: ['users', 'all'],
    queryFn: async () => {
      const res = await fetch('/api/users');

      if (!res.ok) {
        throw new Error("Failed to fetch notes");
      }
      return res.json();
    },
  })
})


export { useAtom, voiceNoteAtom, selectedDurationAtom, selectedLanguageAtom, transcribedAtom, selectedCategoryAtom, submittedDataAtom, mutateVoiceNoteAtom, authAtom, toggleAtom, apiKeyAtom, usersAtom }
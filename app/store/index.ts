import { atom, useAtom } from 'jotai'
import { atomWithQuery, atomWithMutation } from 'jotai-tanstack-query'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { ISODateString } from 'next-auth';
import { toast } from 'sonner'

// Define the User type
interface User {
  name: string | undefined | null;
  email: string | undefined | null;
  image: string | undefined | null;
}

// Define the Auth type
export interface Auth {
  user?: User;
  expires: ISODateString; // Date is typically represented as a string in ISO format
}

const authContent: Auth = {
  user: {
    name: "",
    email: "",
    image: "",
  },
  expires: "",
};

// toggle atom for data descending and ascending
const toggleAtom = atom(false);

const apiKeyAtom = atom<string>("");

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

export type SubmittedNoteData = {
  _id?: string;
  english: string;
  context: string;
  audioUrl: string;
  email: string;
  transcribedText?: string;
  category: string | null;
  lang: string;
  duration: number;
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

const submitted_storage = createJSONStorage<SubmittedNoteData>(
  () => sessionStorage,
)

const auth_storage = createJSONStorage<Auth>(
  () => sessionStorage,
)

const authAtom = atomWithStorage<Auth>('user-email', authContent, auth_storage)
const transcribedAtom = atomWithStorage<TranscribedData>('transcribed-data', transcribedContent, transcribed_storage)
const selectedCategoryAtom = atom<string>(""); // Initialize with null or a default value
const submittedDataAtom = atomWithStorage<SubmittedNoteData>('submitted-data', submittedContent, submitted_storage) // Initialize with null or a default value

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
    onSuccess: async () => {
      //  
    }
  })
});

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

const usersAtom = atomWithQuery(() => {
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
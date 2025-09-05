import { atom, useAtom } from 'jotai'
import { atomWithInfiniteQuery, atomWithQuery } from 'jotai-tanstack-query'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

const idAtom = atom(1)
const userAtom = atomWithQuery((get) => ({
  queryKey: ['users', get(idAtom)],
  queryFn: async ({ queryKey: [, id] }) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    return res.json()
  },
}))

const selectedLanguageAtom = atom<string | undefined>(undefined);
const selectedDurationAtom = atom<string | undefined>(undefined);
export interface TranscribedData {
  burmese: string;
  english: string;
  context: string;
  editedText: string;
  category?: string;
}
const content = {
  burmese: "",
  english: "",
  context: "",
  editedText: "",
  category: "",
}
const storage = createJSONStorage<TranscribedData>(
  // getStringStorage
  () => sessionStorage, // or sessionStorage, asyncStorage or alike
  // // options (optional)
  // {
  //   reviver, // optional reviver option for JSON.parse
  //   replacer, // optional replacer option for JSON.stringify
  // },
)
const transcribedAtom = atomWithStorage('transcribed-data', content, storage)
const selectedCategoryAtom = atom<string | undefined>(undefined); // Initialize with null or a default value
const submittedDataAtom = atomWithStorage('submitted-data', content, storage) // Initialize with null or a default value


export { useAtom, userAtom, selectedDurationAtom, selectedLanguageAtom, transcribedAtom, selectedCategoryAtom, submittedDataAtom }
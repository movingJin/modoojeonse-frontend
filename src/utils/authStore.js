import AsyncStorage from "@react-native-async-storage/async-storage";
import {create} from 'zustand';
import {persist, createJSONStorage} from "zustand/middleware";

const authStore = create(
    persist(
        (set, get) => ({
            accessToken: null,
            refreshToken: null,
            email: null,
            name: null,
            phone: null,
            roles: null,
            setAccessToken: (value) => set({accessToken: value}),
            setRefreshToken: (value) => set({refreshToken: value}),
            setEmail: (value) => set({email: value}),
            setName: (value) => set({name: value}),
            setPhone: (value) => set({phone: value}),
            setRoles: (value) => set({roles: value}),
            clearTokens: () =>
              set({
                accessToken: null,
                refreshToken: null,
                email: null,
                name: null,
                phone: null,
                roles: null
              })
        }),
        {
            name: 'auth-store',
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
)

// const authStore = create(
//     persist(
//       (set) => ({
//         accessToken: '',
//         setAccessToken: (value) => set({accessToken: value}),
//       }),
//       {
//         name: 'auth-store',
//       },
//     ),
// );
export default authStore;
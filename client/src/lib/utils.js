import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/* -------------------------------*Analisi del Codice* --------------------

Questa funzione `cn` serve per **gestire classi CSS in modo dinamico ed efficiente**, 
specialmente quando si utilizza **Tailwind CSS** con **React**.

### 📌 **Cosa fanno `clsx` e `tailwind-merge`?**

1. clsx(inputs)
   - `clsx` è una libreria che aiuta a combinare classi CSS in modo pulito e sicuro.
   - Può accettare **stringhe, array e oggetti booleani** per includere o escludere classi dinamicamente.

   **Esempio di `clsx`:
   clsx("text-red-500", false && "hidden", "font-bold") 
   // 👉 "text-red-500 font-bold" (esclude "hidden" perché false)
   ```

2. **`twMerge(clsx(inputs))`**
   - `tailwind-merge` (`twMerge`) risolve conflitti tra classi di Tailwind CSS.
   - Se due classi che modificano lo stesso stile (es. `text-red-500` e `text-blue-500`) vengono passate, `twMerge` tiene **solo l'ultima classe valida**.

   **Esempio di `twMerge`:**
   ```js
   twMerge("text-red-500 text-blue-500") 
   // 👉 "text-blue-500" (rimuove `text-red-500` perché sovrascritto)
   ```

### 🛠 **Funzionamento della funzione `cn`**
La funzione `cn` prende una lista di classi (`...inputs`), le combina con `clsx` e poi 
risolve eventuali conflitti con `twMerge`.

```js
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

**✅ Vantaggi:**
- Permette di scrivere classi CSS in modo dinamico ed elegante.
- Evita classi duplicate o in conflitto in Tailwind CSS.
- Rende il codice più leggibile e manutenibile.

### 💡 **Esempio d'uso in un componente React**
```jsx
import { cn } from "./utils"; // Importa la funzione cn

export default function Button({ primary }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded",
        primary ? "bg-blue-500 text-white" : "bg-gray-300 text-black",
        "hover:opacity-80"
      )}
    >
      Cliccami
    </button>
  );
}

🔹 **Se `primary` è `true`**, il bottone avrà **`bg-blue-500 text-white`**.  
🔹 **Se `primary` è `false`**, avrà **`bg-gray-300 text-black`**.  

Grazie a `cn`, non dobbiamo preoccuparci di gestire le classi in modo manuale o rischiare conflitti! 🚀
*/

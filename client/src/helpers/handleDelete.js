export const deleteData = async (endpoint) => {
    if (!confirm("Sei sicuro di voler eliminare?")) return false; 
  
    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error(`Errore ${response.status}: ${response.statusText}`);
      }
  
      return true; // Eliminazione avvenuta con successo
    } catch (error) {
      console.error("Errore nella richiesta di eliminazione:", error.message);
      return false;
    }
  };
  
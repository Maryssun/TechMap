/* =====================================================
   TechMap - Data Loader
   Carregamento centralizado de arquivos JSON
   ===================================================== */

const DataLoader = (() => {
  const BASE_DATA_PATH = getBaseDataPath();

  function getBaseDataPath() {
    const path = window.location.pathname;
    return path.includes("/pages/") ? "../data/" : "./data/";
  }

  async function fetchJSON(fileName) {
    const filePath = `${BASE_DATA_PATH}${fileName}`;

    try {
      const response = await fetch(filePath, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao carregar ${fileName}: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`[DataLoader] ${error.message}`);
      return null;
    }
  }

  async function loadAreas() {
    return await fetchJSON("areas.json");
  }

  async function loadPaths() {
    return await fetchJSON("paths.json");
  }

  async function loadStudies() {
    return await fetchJSON("studies.json");
  }

  async function loadTools() {
    return await fetchJSON("tools.json");
  }

  async function loadCommunities() {
    return await fetchJSON("communities.json");
  }

  async function loadResources() {
    return await fetchJSON("resources.json");
  }

  async function loadQuestionnaire() {
    return await fetchJSON("questionnaire.json");
  }

  async function loadSettings() {
    return await fetchJSON("settings.json");
  }

  async function loadAllCoreData() {
    const [
      areas,
      paths,
      studies,
      tools,
      communities,
      resources
    ] = await Promise.all([
      loadAreas(),
      loadPaths(),
      loadStudies(),
      loadTools(),
      loadCommunities(),
      loadResources()
    ]);

    return {
      areas,
      paths,
      studies,
      tools,
      communities,
      resources
    };
  }

  async function loadByPage(pageName) {
    switch (pageName) {
      case "discover":
        return {
          questionnaire: await loadQuestionnaire(),
          resources: await loadResources()
        };

      case "areas":
        return {
          areas: await loadAreas()
        };

      case "paths":
        return {
          paths: await loadPaths()
        };

      case "study":
        return {
          studies: await loadStudies(),
          resources: await loadResources()
        };

      case "tools":
        return {
          tools: await loadTools()
        };

      case "community":
        return {
          communities: await loadCommunities()
        };

      case "home":
      default:
        return await loadAllCoreData();
    }
  }

  return {
    fetchJSON,
    loadAreas,
    loadPaths,
    loadStudies,
    loadTools,
    loadCommunities,
    loadResources,
    loadQuestionnaire,
    loadSettings,
    loadAllCoreData,
    loadByPage
  };
})();
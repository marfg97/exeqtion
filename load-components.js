// components-loader.js
const CONFIG = {
  CACHE_DURATION: 3600 * 1000, 
  LOADING_HTML: '<div class="loading-spinner">Cargando componente...</div>',
  COMPONENTS: [
    { 
      id: 'header-container',
      file: 'components/header.html',
      priority: 1 
    },
    {
      id: 'contact-form-container',
      file: 'components/form.html',
      priority: 2
    },
    {
      id: 'social-section-container',
      file: 'components/social.html',
      priority: 3,
    },
    {
      id: 'copyright',
      file: 'components/copyright.html',
      priority: 4,
    }
  ]
};

// Núcleo del cargador
class ComponentLoader {
  constructor() {
    this.cache = window.localStorage;
    this.loadQueue = [];
  }

  async init() {
    this.createLoadingStates();
    await this.loadComponents();
  }

  createLoadingStates() {
    CONFIG.COMPONENTS.forEach(component => {
      const container = document.getElementById(component.id);
      if (container) {
        container.innerHTML = CONFIG.LOADING_HTML;
      }
    });
  }

  async loadComponents() {
    try {
      // Ordenar componentes por prioridad
      const sortedComponents = [...CONFIG.COMPONENTS].sort((a, b) => a.priority - b.priority);
      
      // Cargar componentes en secuencia
      for (const component of sortedComponents) {
        await this.loadComponent(component);
      }
    } catch (error) {
      console.error('Error loading components:', error);
      this.handleLoadingErrors();
    }
  }

  async loadComponent(component) {
    try {
      const container = document.getElementById(component.id);
      if (!container) return;

      // // Verificar caché válido
      // const cached = this.getCachedComponent(component.file);
      // if (cached) {
      //   container.innerHTML = cached;
      //   this.executeScripts(container);
      //   return;
      // }

      // Cargar desde red
      const response = await fetch(component.file);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const html = await response.text();
      container.innerHTML = html;
      this.executeScripts(container);
      this.cacheComponent(component.file, html);

    } catch (error) {
      console.error(`Error loading ${component.file}:`, error);
      this.showErrorState(component.id);
      throw error;
    }
  }


  executeScripts(container) {
    const scripts = Array.from(container.getElementsByTagName('script'));
  
    scripts.forEach(script => {
      const newScript = document.createElement('script');
  
      // Detectar si es módulo
      const isModule = /import[\s(]|import\.meta/.test(script.textContent || '');
  
      if (script.src) {
        newScript.src = script.src;
        newScript.async = false;
        if (isModule) newScript.type = 'module';
      } else {
        newScript.textContent = script.textContent;
        if (isModule) newScript.type = 'module';
      }
  
      document.body.appendChild(newScript);
    });
  }
  

  getCachedComponent(file) {
    const cacheKey = `component:${file}`;
    const cached = this.cache.getItem(cacheKey);
    if (!cached) return null;

    const { timestamp, html } = JSON.parse(cached);
    return (Date.now() - timestamp < CONFIG.CACHE_DURATION) ? html : null;
  }

  cacheComponent(file, html) {
    const cacheKey = `component:${file}`;
    this.cache.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      html: html
    }));
  }

  showErrorState(componentId) {
    const container = document.getElementById(componentId);
    if (container) {
      container.innerHTML = `
        <div class="error-state">
          <p>⚠️ Error cargando el componente</p>
          <button onclick="location.reload()">Reintentar</button>
        </div>
      `;
    }
  }

  handleLoadingErrors() {
    console.warn('Attempting fallback to cached versions...');
    CONFIG.COMPONENTS.forEach(component => {
      const cached = this.getCachedComponent(component.file);
      if (cached) {
        const container = document.getElementById(component.id);
        if (container) container.innerHTML = cached;
      }
    });
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  const loader = new ComponentLoader();
  loader.init();
});
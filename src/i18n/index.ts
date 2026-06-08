import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  "pt-BR": {
    translation: {
      common: {
        app_name: "GitDog Caramelo",
        logout: "Sair",
        save: "Salvar",
        cancel: "Cancelar",
        delete: "Excluir",
        edit: "Editar",
        create: "Criar",
        actions: "Ações",
        status: "Status",
        search: "Pesquisar...",
        loading: "Carregando...",
        success: "Sucesso!",
        error: "Ocorreu um erro.",
        version: "Versão",
        author: "Autor",
        date: "Data",
        comments: "Comentários",
        no_data: "Nenhum dado encontrado",
        back: "Voltar",
        admin_warning: "Você precisa de privilégios de Admin para esta ação."
      },
      nav: {
        dashboard: "Painel Geral",
        workflows: "Workflows",
        environments: "Ambientes n8n",
        releases: "Gestão de Releases",
        deploy: "Deploys & Rollback",
        audit: "Auditoria",
        users: "Usuários & RBAC",
        language: "Idioma",
        theme: "Tema"
      },
      login: {
        title: "Entrar no GitDog Caramelo",
        subtitle: "Plataforma Open Source de n8n DevOps",
        email: "E-mail",
        password: "Senha",
        submit: "Entrar",
        invalid_credentials: "E-mail ou senha inválidos",
        demo_info: "Logins de demonstração disponíveis no rodapé."
      },
      dashboard: {
        title: "Resumo Operacional",
        total_workflows: "Total de Workflows",
        total_versions: "Versões Armazenadas",
        total_deploys: "Deploys Realizados",
        active_environments: "Ambientes n8n",
        recent_deploys: "Deploys Recentes",
        recent_activities: "Atividades Recentes de Auditoria",
        health_indicators: "Saúde da Infraestrutura",
        deploy_flow_title: "Fluxo de Entrega Contínua (CICD)",
        metrics: "Métricas de Performance",
        sync_rate: "Taxa de Sincronização",
        rollback_rate: "Taxa de Rollbacks"
      },
      workflows: {
        title: "Workflows Versionados",
        create_new: "Novo Workflow",
        workflow_name: "Nome do Workflow",
        description: "Descrição",
        latest_version: "Última Versão",
        view_history: "Ver Histórico de Versões",
        create_version_btn: "Salvar Nova Versão",
        version_comment: "Comentário da Versão (Commit Message)",
        edit_nodes: "Editor Visual de Nodes (Simulado)",
        add_node: "Adicionar Node n8n",
        node_name: "Nome do Node",
        node_type: "Tipo do Node",
        save_changes: "Salvar Alterações como Versão",
        diff_title: "Comparação de Versões",
        select_versions_compare: "Selecione duas versões para comparar",
        v_left: "Versão Anterior",
        v_right: "Versão Recente",
        diff_added: "Nodes Adicionados",
        diff_removed: "Nodes Removidos",
        diff_modified: "Nodes Modificados",
        diff_no_changes: "Nenhuma diferença estrutural entre as duas versões."
      },
      environments: {
        title: "Ambientes n8n Integrados",
        add_new: "Cadastrar Ambiente",
        name: "Nome (Ex: DEV, PROD)",
        url: "URL da API do n8n",
        api_key: "API Key (n8n Token)",
        test_connection: "Testar Conexão",
        connection_success: "Conexão estabelecida com sucesso!",
        connection_failed: "Falha ao conectar ao n8n API."
      },
      releases: {
        title: "Gestão de Releases",
        create_release: "Gerar Nova Release",
        release_name: "Nome da Release (Ex: Release 1.2.0)",
        description: "Objetivo da Release",
        select_workflow_vers: "Escolha o workflow e a versão desejada",
        add_workflow: "Adicionar à Release",
        empty_release: "Sua release precisa ter ao menos um item.",
        success_created: "Release criada com sucesso!"
      },
      deploy: {
        title: "Deploy & Rollback",
        select_deploy_type: "Tipo de Deploy",
        deploy_single_wf: "Workflow Individual",
        deploy_release_pack: "Pacote de Release Completo",
        select_target_env: "Ambiente de Destino",
        execute_deploy_btn: "Executar Deploy",
        rollback_title: "Rollback Veloz",
        rollback_desc: "Selecione um workflow e reverta instantaneamente para qualquer versão anterior. Um novo commit será gerado preservando a integridade histórica.",
        execute_rollback_btn: "Executar Rollback",
        logs: "Logs de Execução em Tempo Real",
        deploy_success: "Deploy finalizado com sucesso!",
        rollback_success: "Rollback completado. Nova versão gerada!"
      },
      audit: {
        title: "Trilha de Auditoria Geral",
        table_user: "Operador",
        table_action: "Operação",
        table_object: "Objeto Afetado",
        table_ip: "Endereço IP",
        table_date: "Instante",
        table_result: "Resultado"
      },
      users: {
        title: "Gestão de Usuários e RBAC",
        add_new: "Convidar Operador",
        role: "Perfil de Acesso",
        permissions_matrix: "Matriz de Permissões"
      }
    }
  },
  "en-US": {
    translation: {
      common: {
        app_name: "GitDog Caramelo",
        logout: "Logout",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        create: "Create",
        actions: "Actions",
        status: "Status",
        search: "Search...",
        loading: "Loading...",
        success: "Success!",
        error: "An error occurred.",
        version: "Version",
        author: "Author",
        date: "Date",
        comments: "Comments",
        no_data: "No data found",
        back: "Back",
        admin_warning: "You need Admin privileges to perform this action."
      },
      nav: {
        dashboard: "Dashboard",
        workflows: "Workflows",
        environments: "n8n Environments",
        releases: "Release Management",
        deploy: "Deploy & Rollback",
        audit: "Audit Trail",
        users: "Users & RBAC",
        language: "Language",
        theme: "Theme"
      },
      login: {
        title: "Log in to GitDog Caramelo",
        subtitle: "Open Source Platform for n8n DevOps",
        email: "Email Address",
        password: "Password",
        submit: "Login",
        invalid_credentials: "Invalid email or password",
        demo_info: "Demo logins available in the footer."
      },
      dashboard: {
        title: "Operational Status",
        total_workflows: "Total Workflows",
        total_versions: "Stored Versions",
        total_deploys: "Deploys Executed",
        active_environments: "n8n Environments",
        recent_deploys: "Recent Deployments",
        recent_activities: "Recent Audit Activities",
        health_indicators: "Infrastructure Health",
        deploy_flow_title: "Continuous Delivery Flow (CICD)",
        metrics: "Performance Metrics",
        sync_rate: "Sync Success Rate",
        rollback_rate: "Rollback Frequency"
      },
      workflows: {
        title: "Versioned Workflows",
        create_new: "New Workflow",
        workflow_name: "Workflow Name",
        description: "Description",
        latest_version: "Latest Version",
        view_history: "View Version History",
        create_version_btn: "Save New Version",
        version_comment: "Version Comment (Commit Message)",
        edit_nodes: "Visual Node Editor (Mock)",
        add_node: "Add n8n Node",
        node_name: "Node Name",
        node_type: "Node Type",
        save_changes: "Save Changes as Version",
        diff_title: "Version Comparison (Diff)",
        select_versions_compare: "Select two versions to compare",
        v_left: "Previous Version",
        v_right: "Recent Version",
        diff_added: "Added Nodes",
        diff_removed: "Removed Nodes",
        diff_modified: "Modified Nodes",
        diff_no_changes: "No structural differences between these two versions."
      },
      environments: {
        title: "Integrated n8n Environments",
        add_new: "Register Environment",
        name: "Name (e.g., DEV, PROD)",
        url: "n8n API URL",
        api_key: "API Key (n8n Token)",
        test_connection: "Test Connection",
        connection_success: "Connection established successfully!",
        connection_failed: "Failed to connect to n8n API."
      },
      releases: {
        title: "Release Management",
        create_release: "Create New Release",
        release_name: "Release Name (e.g. Release 1.2.0)",
        description: "Release Objective",
        select_workflow_vers: "Choose workflow and desired version",
        add_workflow: "Add to Release",
        empty_release: "Your release must contain at least one item.",
        success_created: "Release created successfully!"
      },
      deploy: {
        title: "Deploy & Rollback",
        select_deploy_type: "Deployment Type",
        deploy_single_wf: "Single Workflow",
        deploy_release_pack: "Complete Release Bundle",
        select_target_env: "Destination Environment",
        execute_deploy_btn: "Execute Deployment",
        rollback_title: "Fast Rollback",
        rollback_desc: "Select a workflow and instantly revert to any previous version. A new commit is created, keeping history clean and auditable.",
        execute_rollback_btn: "Execute Rollback",
        logs: "Real-Time Execution Logs",
        deploy_success: "Deployment completed successfully!",
        rollback_success: "Rollback completed. New version registered!"
      },
      audit: {
        title: "Global Audit Log",
        table_user: "Operator",
        table_action: "Action",
        table_object: "Affected Object",
        table_ip: "IP Address",
        table_date: "Timestamp",
        table_result: "Result"
      },
      users: {
        title: "Users Management & RBAC",
        add_new: "Invite Operator",
        role: "Access Profile",
        permissions_matrix: "Permissions Matrix"
      }
    }
  },
  "es-ES": {
    translation: {
      common: {
        app_name: "GitDog Caramelo",
        logout: "Salir",
        save: "Guardar",
        cancel: "Cancelar",
        delete: "Eliminar",
        edit: "Editar",
        create: "Crear",
        actions: "Acciones",
        status: "Estado",
        search: "Buscar...",
        loading: "Cargando...",
        success: "¡Éxito!",
        error: "Ocurrió un error.",
        version: "Versión",
        author: "Autor",
        date: "Fecha",
        comments: "Comentarios",
        no_data: "No se encontraron datos",
        back: "Volver",
        admin_warning: "Se requieren privilegios de Administrador para esta acción."
      },
      nav: {
        dashboard: "Panel de control",
        workflows: "Flujos (Workflows)",
        environments: "Ambientes n8n",
        releases: "Gestión de Releases",
        deploy: "Despliegues y Rollback",
        audit: "Auditoría",
        users: "Usuarios y RBAC",
        language: "Idioma",
        theme: "Tema"
      },
      login: {
        title: "Iniciar sesión en GitDog Caramelo",
        subtitle: "Plataforma de Código Abierto para DevOps de n8n",
        email: "Correo electrónico",
        password: "Contraseña",
        submit: "Entrar",
        invalid_credentials: "Email o contraseña inválidos",
        demo_info: "Cuentas de demostración disponibles en el pie de página."
      },
      dashboard: {
        title: "Resumen Operativo",
        total_workflows: "Total de Workflows",
        total_versions: "Versiones Almacenadas",
        total_deploys: "Despliegues Ejecutados",
        active_environments: "Ambientes n8n",
        recent_deploys: "Despliegues Recientes",
        recent_activities: "Actividades de Auditoría",
        health_indicators: "Salud del Sistema",
        deploy_flow_title: "Flujo de Integración y Entrega Continua",
        metrics: "Métricas de Rendimiento",
        sync_rate: "Tasa de Sincronización",
        rollback_rate: "Frecuencia de Rollbacks"
      },
      workflows: {
        title: "Workflows Versionados",
        create_new: "Nuevo Workflow",
        workflow_name: "Nombre del Workflow",
        description: "Descripción",
        latest_version: "Última Versión",
        view_history: "Ver Historial de Versiones",
        create_version_btn: "Guardar Nueva Versión",
        version_comment: "Comentario de la Versión (Mensaje de Commit)",
        edit_nodes: "Editor Visual de Nodos (Simulado)",
        add_node: "Añadir Nodo n8n",
        node_name: "Nombre del Nodo",
        node_type: "Tipo del Nodo",
        save_changes: "Guardar Cambios como Versión",
        diff_title: "Comparación de Versiones",
        select_versions_compare: "Seleccione dos versiones para comparar",
        v_left: "Versión Anterior",
        v_right: "Versión Reciente",
        diff_added: "Nodos Añadidos",
        diff_removed: "Nodos Eliminados",
        diff_modified: "Nodos Modificados",
        diff_no_changes: "No hay diferencias de estructura entre estas dos versiones."
      },
      environments: {
        title: "Ambientes n8n Integrados",
        add_new: "Registrar Ambiente",
        name: "Nombre (Ej: DEV, QA, PROD)",
        url: "URL de la API de n8n",
        api_key: "Clave de API n8n",
        test_connection: "Probar Conexión",
        connection_success: "¡Conexión establecida con éxito!",
        connection_failed: "Error al conectar con la API de n8n."
      },
      releases: {
        title: "Gestión de Releases",
        create_release: "Crear Nueva Release",
        release_name: "Nombre de la Release (Ej: Release 1.2.0)",
        description: "Objetivo de la Release",
        select_workflow_vers: "Elija el workflow y la versión",
        add_workflow: "Añadir a la Release",
        empty_release: "Su release debe tener al menos un elemento.",
        success_created: "¡Release creada con éxito!"
      },
      deploy: {
        title: "Despliegues y Rollback",
        select_deploy_type: "Tipo de Despliegue",
        deploy_single_wf: "Workflow Individual",
        deploy_release_pack: "Paquete de Release Completo",
        select_target_env: "Ambiente de Destino",
        execute_deploy_btn: "Ejecutar Despliegue",
        rollback_title: "Rollback Veloz",
        rollback_desc: "Seleccione un workflow y revierta instantáneamente a cualquier versión anterior. Se creará un nuevo commit preservando el historial completo.",
        execute_rollback_btn: "Ejecutar Rollback",
        logs: "Logs de Ejecución en Tiempo Real",
        deploy_success: "¡Despliegue finalizado con éxito!",
        rollback_success: "¡Rollback completado con éxito! Nueva versión registrada."
      },
      audit: {
        title: "Registro de Auditoría Global",
        table_user: "Operador",
        table_action: "Operación",
        table_object: "Objeto Afectado",
        table_ip: "Dirección IP",
        table_date: "Momento",
        table_result: "Resultado"
      },
      users: {
        title: "Gestión de Usuarios y RBAC",
        add_new: "Invitar Operador",
        role: "Perfil de Acceso",
        permissions_matrix: "Matriz de Permisos"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("gitdog_lang") || "pt-BR",
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

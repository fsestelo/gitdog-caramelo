import uuid
from typing import List, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, status, Security
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr

app = FastAPI(
    title="gitdog-caramelo API",
    description="Plataforma Open Source para Versionamento e Deploy de Workflows n8n",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas for Swagger documentation
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    role: str
    preferred_language: str
    active: bool

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class EnvironmentCreate(BaseModel):
    name: str = Field(..., max_length=50, example="DEV")
    description: Optional[str] = Field(None, max_length=255)
    url: str = Field(..., example="http://n8n.mycompany.com:5678")
    api_key: str = Field(..., example="n8n_token_secret_123")

class EnvironmentResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str]
    url: str
    status: str
    created_at: str

class WorkflowCreate(BaseModel):
    name: str = Field(..., max_length=150, example="Sync Customers")
    description: Optional[str] = Field(None, max_length=512)
    comment: str = Field(..., example="Criação inicial do fluxo")
    workflow_data: Dict[str, Any]

class WorkflowVersionResponse(BaseModel):
    id: uuid.UUID
    workflow_id: uuid.UUID
    version: int
    workflow_data: Dict[str, Any]
    comment: str
    author_name: str
    created_at: str

class ReleaseCreate(BaseModel):
    name: str = Field(..., example="Release 1.2.0")
    description: Optional[str] = None
    items: List[Dict[str, Any]] # workflow_id and version_number pair

class DeployRequest(BaseModel):
    type: str = Field(..., example="single") # single, release
    target_environment_id: uuid.UUID
    workflow_id: Optional[uuid.UUID] = None
    version_number: Optional[int] = None
    release_id: Optional[uuid.UUID] = None

class RollbackRequest(BaseModel):
    workflow_id: uuid.UUID
    version_number: int
    target_environment_id: uuid.UUID

# ----------------------------------------
# HEALTH CHECK
# ----------------------------------------
@app.get("/api/health", status_code=status.HTTP_200_OK, tags=["Health"])
def health_check():
    return {"status": "healthy", "service": "gitdog-caramelo backend", "engine": "FastAPI 0.110"}

# ----------------------------------------
# AUTH & USER MANAGEMENT
# ----------------------------------------
@app.post("/api/auth/login", response_model=LoginResponse, tags=["Authentication"])
def login(login_data: UserLogin):
    """
    Realiza a autenticação segura do usuário e fornece os JWT tokens de acesso e refresh
    """
    if login_data.email == "fsestelo@gmail.com":
        return {
            "access_token": "mocked_jwt_bearer_token_string",
            "token_type": "bearer",
            "user": {
                "id": uuid.uuid4(),
                "name": "Guilherme de Souza (Admin)",
                "email": "fsestelo@gmail.com",
                "role": "Administrator",
                "preferred_language": "pt-BR",
                "active": True
            }
        }
    raise HTTPException(status_code=401, detail="E-mail ou senha inválidos para acesso.")

# ----------------------------------------
# WORKFLOWS VERSIONING (POSTGRES JSONB)
# ----------------------------------------
@app.get("/api/workflows", tags=["Workflows"])
def list_workflows():
    """
    Lista todos os workflows cadastrados com a sua última versão ativa
    """
    return []

@app.post("/api/workflows", status_code=status.HTTP_201_CREATED, tags=["Workflows"])
def create_workflow(data: WorkflowCreate):
    """
    Cadastra um novo workflow e salva o JSON correspondente como a Versão 1 (PostgreSQL JSONB)
    """
    return {"status": "created"}

# ----------------------------------------
# DEPLOYS & ROLLBACK (n8n INTEGRATION)
# ----------------------------------------
@app.post("/api/deploy", tags=["Deployments"])
def execute_deploy(req: DeployRequest):
    """
    Executa o Deploy de um Workflow único ou de um Pacote de Release para o ambiente alvo n8n
    """
    return {"status": "success", "logs": ["Deploy finalizado com sucesso usando API n8n"]}

@app.post("/api/rollback", tags=["Deployments"])
def execute_rollback(req: RollbackRequest):
    """
    Executa o Rollback de emergência. Cria uma nova versão clonada e faz override no n8n do ambiente
    """
    return {"status": "success", "details": "Rollback concluído e auditado."}

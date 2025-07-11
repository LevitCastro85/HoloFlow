-- 🚀 HOLOFLOW SUPABASE SCHEMA V2 --
-- Arquitectura de base de datos revisada y optimizada para HoloFlow.
-- Fecha de revisión: 2025-06-27

-- ========= EXTENSIONES REQUERIDAS =========
-- Habilita la función `gen_random_uuid()` para generar UUIDs.
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "public";
-- Habilita el manejo de tipos de datos UUID.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "public";

-- ========= ENUMS (TIPOS DE DATOS PERSONALIZADOS) =========
-- Define los posibles estados para un cliente.
CREATE TYPE public.client_status AS ENUM ('activo', 'inactivo', 'potencial', 'pausado', 'suspendido');
-- Define los tipos de cliente (jurídico o persona natural).
CREATE TYPE public.client_type AS ENUM ('empresa', 'persona');
-- Define los métodos de pago aceptados.
CREATE TYPE public.payment_method AS ENUM ('transferencia', 'domiciliación bancaria', 'paypal', 'tarjeta');
-- Define la disponibilidad de un colaborador.
CREATE TYPE public.collaborator_availability AS ENUM ('disponible', 'ocupado', 'no disponible');
-- Define los tipos de colaborador.
CREATE TYPE public.collaborator_type AS ENUM ('interno', 'freelancer');
-- Define el estado de la solicitud de un colaborador.
CREATE TYPE public.collaborator_status AS ENUM ('pending_email_confirmation', 'pending_approval', 'approved', 'rejected');
-- Define los estados por los que puede pasar una tarea.
CREATE TYPE public.task_status AS ENUM ('en-fila', 'en-proceso', 'revision', 'requiere-atencion', 'entregado', 'cancelado');
-- Define los niveles de prioridad de una tarea.
CREATE TYPE public.task_priority AS ENUM ('baja', 'media', 'alta', 'urgente');
-- Define la frecuencia de un contrato.
CREATE TYPE public.contract_frequency AS ENUM ('unica', 'mensual', 'campaña');
-- Define el tipo de periodo de un contrato.
CREATE TYPE public.contract_period AS ENUM ('fijo', 'renovable', 'indeterminado');
-- Define el estado de un contrato.
CREATE TYPE public.contract_status AS ENUM ('activo', 'finalizado', 'cancelado');
-- Define el estado de revisión de un recurso.
CREATE TYPE public.resource_status AS ENUM ('pendiente-revision', 'necesita-cambios', 'aprobado', 'rechazado', 'en-uso');

-- ========= TABLA DE CLIENTES (clients) =========
-- Almacena la información de los clientes del estudio.
CREATE TABLE public.clients (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  city TEXT,
  region TEXT,
  onboarding_date DATE,
  internal_notes TEXT,
  client_type public.client_type,
  requires_invoice BOOLEAN NOT NULL DEFAULT false,
  tax_id TEXT,
  payment_method public.payment_method,
  status public.client_status NOT NULL DEFAULT 'activo'::public.client_status
);
COMMENT ON TABLE public.clients IS 'Almacena la información de los clientes del estudio.';

-- ========= TABLA DE MARCAS (brands) =========
-- Almacena las marcas asociadas a cada cliente.
CREATE TABLE public.brands (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  client_id BIGINT NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT,
  website_url TEXT,
  manages_socials BOOLEAN NOT NULL DEFAULT false,
  social_media_links JSONB,
  internal_notes TEXT,
  clienteid BIGINT REFERENCES public.clients(id) ON DELETE SET NULL
);
COMMENT ON TABLE public.brands IS 'Almacena las marcas asociadas a cada cliente.';
COMMENT ON COLUMN public.brands.clienteid IS 'Columna duplicada de client_id, probablemente por un error de tipeo. Mantener por retrocompatibilidad, pero se recomienda migrar y eliminar.';


-- ========= TABLA DE COLABORADORES (collaborators) =========
-- Gestiona tanto al equipo interno como a los freelancers.
CREATE TABLE public.collaborators (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  whatsapp TEXT,
  country TEXT,
  state TEXT,
  city TEXT,
  professional_description TEXT,
  specialties TEXT[],
  role TEXT,
  has_system_access BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  collaborator_type public.collaborator_type,
  availability public.collaborator_availability NOT NULL DEFAULT 'disponible'::public.collaborator_availability,
  base_activity_rate NUMERIC,
  weekly_salary NUMERIC,
  rating NUMERIC,
  onboarding_date DATE,
  notes TEXT,
  profile_photo_url TEXT,
  status public.collaborator_status NOT NULL DEFAULT 'pending_email_confirmation'::public.collaborator_status,
  specialty TEXT
);
COMMENT ON TABLE public.collaborators IS 'Gestiona tanto al equipo interno como a los freelancers.';
COMMENT ON COLUMN public.collaborators.specialty IS 'Campo legado. Usar el array `specialties` para múltiples especialidades.';

-- ========= TABLA DE CATEGORÍAS DE SERVICIOS (service_categories) =========
-- Agrupa los servicios en categorías para una mejor organización.
CREATE TABLE public.service_categories (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INT
);
COMMENT ON TABLE public.service_categories IS 'Agrupa los servicios en categorías para una mejor organización.';

-- ========= TABLA DE SERVICIOS (services) =========
-- Catálogo de servicios que ofrece el estudio.
CREATE TABLE public.services (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  name TEXT NOT NULL,
  description TEXT,
  category_id BIGINT REFERENCES public.service_categories(id) ON DELETE SET NULL,
  estimated_days INT,
  base_price NUMERIC NOT NULL,
  notes TEXT
);
COMMENT ON TABLE public.services IS 'Catálogo de servicios que ofrece el estudio.';

-- ========= TABLA DE PRECIOS PERSONALIZADOS (client_prices) =========
-- Define precios especiales para servicios específicos por cliente.
CREATE TABLE public.client_prices (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  service_id BIGINT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  custom_price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (client_id, service_id)
);
COMMENT ON TABLE public.client_prices IS 'Define precios especiales para servicios específicos por cliente.';

-- ========= TABLA DE RECURSOS (resources) =========
-- Banco de archivos y entregables.
CREATE TABLE public.resources (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  name TEXT NOT NULL,
  description TEXT,
  file_name TEXT,
  file_url TEXT,
  file_type TEXT,
  size BIGINT,
  platform TEXT,
  delivery_method TEXT,
  tags TEXT[],
  category TEXT,
  status public.resource_status NOT NULL DEFAULT 'pendiente-revision'::public.resource_status,
  uploaded_by BIGINT REFERENCES public.collaborators(id) ON DELETE SET NULL,
  submitted_by TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  review_notes TEXT,
  task_id BIGINT,
  brand_id BIGINT REFERENCES public.brands(id) ON DELETE SET NULL,
  client_id BIGINT REFERENCES public.clients(id) ON DELETE SET NULL,
  service_id BIGINT REFERENCES public.services(id) ON DELETE SET NULL,
  delivery_notes TEXT,
  upload_date TIMESTAMPTZ,
  related_tasks BIGINT[]
);
COMMENT ON TABLE public.resources IS 'Banco de archivos, URLs y entregables del sistema.';

-- ========= TABLA DE TAREAS (tasks) =========
-- Unidad de trabajo fundamental del sistema.
CREATE TABLE public.tasks (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  brand_id BIGINT NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  client_id BIGINT REFERENCES public.clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  brief TEXT,
  status public.task_status NOT NULL DEFAULT 'en-fila'::public.task_status,
  priority public.task_priority NOT NULL DEFAULT 'media'::public.task_priority,
  request_date DATE,
  due_date DATE,
  assignment_date DATE,
  assigned_to BIGINT REFERENCES public.collaborators(id) ON DELETE SET NULL,
  assigned_by_user TEXT,
  service_id BIGINT REFERENCES public.services(id) ON DELETE SET NULL,
  price NUMERIC,
  custom_price BOOLEAN,
  notes TEXT,
  ai_automation BOOLEAN,
  calendar_event_id TEXT,
  calendar_event_title TEXT,
  social_network TEXT,
  campaign_theme TEXT,
  header_text TEXT,
  descriptive_text TEXT,
  call_to_action TEXT,
  related_resource_id BIGINT REFERENCES public.resources(id) ON DELETE SET NULL,
  origen TEXT,
  content_format TEXT,
  platform TEXT,
  dimensions TEXT,
  custom_dimensions TEXT,
  message_tone TEXT,
  key_message TEXT,
  visual_style TEXT,
  visual_references TEXT,
  location TEXT,
  exact_address TEXT,
  session_date DATE,
  session_time TIME,
  production_type TEXT,
  production_objective TEXT,
  technical_requirements TEXT,
  equipment_needed TEXT,
  involved_personnel TEXT,
  reference_material TEXT,
  task_objective TEXT,
  deliverable_type TEXT,
  final_format TEXT,
  central_theme TEXT,
  reference_information TEXT,
  previous_documents TEXT,
  website_url TEXT,
  task_type TEXT,
  cms_tool TEXT,
  site_type TEXT,
  work_focus TEXT,
  specific_activities TEXT,
  base_structure TEXT,
  follow_up_type TEXT,
  specific_changes TEXT
);
COMMENT ON TABLE public.tasks IS 'Unidad de trabajo fundamental del sistema.';

-- Añadir FK faltante en resources
ALTER TABLE public.resources
ADD CONSTRAINT resources_task_id_fkey
FOREIGN KEY (task_id)
REFERENCES public.tasks(id)
ON DELETE SET NULL;

-- ========= TABLA DE HISTORIAL DE REVISIÓN DE RECURSOS (resource_review_history) =========
CREATE TABLE public.resource_review_history (
  id BIGSERIAL PRIMARY KEY,
  resource_id BIGINT NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  reviewer_name TEXT,
  previous_status public.resource_status,
  new_status public.resource_status,
  notes TEXT
);
COMMENT ON TABLE public.resource_review_history IS 'Auditoría de los cambios de estado de los recursos.';

-- ========= TABLA DE CONTRATOS (contracts) =========
-- Almacena los acuerdos comerciales con los clientes.
CREATE TABLE public.contracts (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  client_id BIGINT NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  service_id BIGINT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  final_price NUMERIC NOT NULL,
  frequency public.contract_frequency,
  start_date DATE NOT NULL,
  end_date DATE,
  period_type public.contract_period,
  notes TEXT,
  status public.contract_status NOT NULL DEFAULT 'activo'::public.contract_status
);
COMMENT ON TABLE public.contracts IS 'Almacena los acuerdos comerciales con los clientes.';

-- ========= TABLA DE BRANDING (brandings) =========
-- Almacena la identidad visual y guías de estilo de las marcas.
CREATE TABLE public.brandings (
  id BIGSERIAL PRIMARY KEY,
  brand_id BIGINT NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  client_id BIGINT NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
COMMENT ON TABLE public.brandings IS 'Almacena la identidad visual y guías de estilo de las marcas.';

-- ========= FUNCIONES Y TRIGGERS =========
-- Función para actualizar el estado de un colaborador después de confirmar su email.
CREATE OR REPLACE FUNCTION public.handle_collaborator_confirmation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.collaborators
  SET status = 'pending_approval'
  WHERE email = NEW.email AND status = 'pending_email_confirmation';
  RETURN NEW;
END;
$$;

-- Trigger que se activa después de que un usuario confirma su email.
CREATE TRIGGER on_user_confirmed
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.handle_collaborator_confirmation();
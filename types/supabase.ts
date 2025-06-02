export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      usuario: {
        Row: {
          id_usuario: string
          nombre: string | null
          primer_apellido: string | null
          segundo_apellido: string | null
        }
        Insert: {
          id_usuario?: string
          nombre?: string | null
          primer_apellido?: string | null
          segundo_apellido?: string | null
        }
        Update: {
          id_usuario?: string
          nombre?: string | null
          primer_apellido?: string | null
          segundo_apellido?: string | null
        }
      }
      subasta: {
        Row: {
          id_subasta: string
          titulo: string | null
          descripcion: string | null
          estado: string | null
          inicio: string | null
          fin: string | null
          precio_base: number | null
          monto_minimo_puja: number | null
          cantidad_max_participantes: number | null
          ficha: string
          motivo_cancelacion: string | null
        }
        Insert: {
          id_subasta?: string
          titulo?: string | null
          descripcion?: string | null
          estado?: string | null
          inicio?: string | null
          fin?: string | null
          precio_base?: number | null
          monto_minimo_puja?: number | null
          cantidad_max_participantes?: number | null
          ficha: string
          motivo_cancelacion?: string | null
        }
        Update: {
          id_subasta?: string
          titulo?: string | null
          descripcion?: string | null
          estado?: string | null
          inicio?: string | null
          fin?: string | null
          precio_base?: number | null
          monto_minimo_puja?: number | null
          cantidad_max_participantes?: number | null
          ficha?: string
          motivo_cancelacion?: string | null
        }
      }
      vehiculo: {
        Row: {
          ficha: string
          anio: number | null
          modelo: string | null
          descripcion: string | null
          imagen_url: string | null
        }
        Insert: {
          ficha?: string
          anio?: number | null
          modelo?: string | null
          descripcion?: string | null
          imagen_url?: string | null
        }
        Update: {
          ficha?: string
          anio?: number | null
          modelo?: string | null
          descripcion?: string | null
          imagen_url?: string | null
        }
      }
      postor: {
        Row: {
          id_postor: string
          telefono: string | null
          id_usuario: string
        }
        Insert: {
          id_postor?: string
          telefono?: string | null
          id_usuario: string
        }
        Update: {
          id_postor?: string
          telefono?: string | null
          id_usuario?: string
        }
      }
      participa: {
        Row: {
          id_postor: string
          id_subasta: string
        }
        Insert: {
          id_postor: string
          id_subasta: string
        }
        Update: {
          id_postor?: string
          id_subasta?: string
        }
      }
      puja: {
        Row: {
          id_puja: string
          id_postor: string
          id_subasta: string
          monto: number | null
          hora: string | null
          fecha: string | null
        }
        Insert: {
          id_puja?: string
          id_postor: string
          id_subasta: string
          monto?: number | null
          hora?: string | null
          fecha?: string | null
        }
        Update: {
          id_puja?: string
          id_postor?: string
          id_subasta?: string
          monto?: number | null
          hora?: string | null
          fecha?: string | null
        }
      }
      adjudicacion: {
        Row: {
          id_adjudicacion: string
          fecha: string | null
          hora: string | null
          monto_final: number | null
          id_subasta: string
          id_postor: string
          id_subastador: string
        }
        Insert: {
          id_adjudicacion?: string
          fecha?: string | null
          hora?: string | null
          monto_final?: number | null
          id_subasta: string
          id_postor: string
          id_subastador: string
        }
        Update: {
          id_adjudicacion?: string
          fecha?: string | null
          hora?: string | null
          monto_final?: number | null
          id_subasta?: string
          id_postor?: string
          id_subastador?: string
        }
      }
    }
  }
}

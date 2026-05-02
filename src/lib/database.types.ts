export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string | null
          event_id: string | null
          event_type: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assinaturas_mais_vanta: {
        Row: {
          cancelamento_solicitado_em: string | null
          ciclo_fim: string | null
          ciclo_inicio: string | null
          comunidade_id: string | null
          criado_em: string
          criado_por: string
          eventos_mv_usados: number | null
          fim: string | null
          id: string
          inicio: string | null
          passes_restantes: number
          plano: string
          plano_id: string | null
          plano_snapshot: Json | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          valor_mensal: number
        }
        Insert: {
          cancelamento_solicitado_em?: string | null
          ciclo_fim?: string | null
          ciclo_inicio?: string | null
          comunidade_id?: string | null
          criado_em?: string
          criado_por: string
          eventos_mv_usados?: number | null
          fim?: string | null
          id?: string
          inicio?: string | null
          passes_restantes?: number
          plano: string
          plano_id?: string | null
          plano_snapshot?: Json | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          valor_mensal?: number
        }
        Update: {
          cancelamento_solicitado_em?: string | null
          ciclo_fim?: string | null
          ciclo_inicio?: string | null
          comunidade_id?: string | null
          criado_em?: string
          criado_por?: string
          eventos_mv_usados?: number | null
          fim?: string | null
          id?: string
          inicio?: string | null
          passes_restantes?: number
          plano?: string
          plano_id?: string | null
          plano_snapshot?: Json | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          valor_mensal?: number
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_mais_vanta_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: true
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assinaturas_mais_vanta_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: true
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assinaturas_mais_vanta_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: true
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assinaturas_mais_vanta_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: true
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "assinaturas_mais_vanta_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: true
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "assinaturas_mais_vanta_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos_mais_vanta"
            referencedColumns: ["id"]
          },
        ]
      }
      atribuicoes_plataforma: {
        Row: {
          ativo: boolean
          atribuido_em: string
          atribuido_por: string
          cargo_id: string
          id: string
          user_id: string
        }
        Insert: {
          ativo?: boolean
          atribuido_em?: string
          atribuido_por: string
          cargo_id: string
          id?: string
          user_id: string
        }
        Update: {
          ativo?: boolean
          atribuido_em?: string
          atribuido_por?: string
          cargo_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "atribuicoes_plataforma_atribuido_por_fkey"
            columns: ["atribuido_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atribuicoes_plataforma_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos_plataforma"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atribuicoes_plataforma_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      atribuicoes_rbac: {
        Row: {
          ativo: boolean
          atribuido_em: string
          atribuido_por: string | null
          cargo: string
          id: string
          permissoes: string[]
          tenant_id: string
          tenant_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ativo?: boolean
          atribuido_em?: string
          atribuido_por?: string | null
          cargo: string
          id?: string
          permissoes?: string[]
          tenant_id: string
          tenant_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ativo?: boolean
          atribuido_em?: string
          atribuido_por?: string | null
          cargo?: string
          id?: string
          permissoes?: string[]
          tenant_id?: string
          tenant_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_name: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          new_value: Json | null
          old_value: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          actor_name?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          actor_name?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      bloqueios: {
        Row: {
          bloqueado_id: string
          bloqueador_id: string
          criado_em: string
          deleted_at: string | null
          id: string
        }
        Insert: {
          bloqueado_id: string
          bloqueador_id: string
          criado_em?: string
          deleted_at?: string | null
          id?: string
        }
        Update: {
          bloqueado_id?: string
          bloqueador_id?: string
          criado_em?: string
          deleted_at?: string | null
          id?: string
        }
        Relationships: []
      }
      campanhas_enviadas: {
        Row: {
          canais: string[]
          destinatarios_count: number
          disparado_em: string
          disparado_por: string
          id: string
          mensagem: string
          resultado_email: Json | null
          resultado_inapp: Json | null
          resultado_push: Json | null
          segmento_tipo: string
          segmento_valor: string | null
          status: string
          titulo: string
        }
        Insert: {
          canais: string[]
          destinatarios_count?: number
          disparado_em?: string
          disparado_por: string
          id?: string
          mensagem: string
          resultado_email?: Json | null
          resultado_inapp?: Json | null
          resultado_push?: Json | null
          segmento_tipo: string
          segmento_valor?: string | null
          status?: string
          titulo: string
        }
        Update: {
          canais?: string[]
          destinatarios_count?: number
          disparado_em?: string
          disparado_por?: string
          id?: string
          mensagem?: string
          resultado_email?: Json | null
          resultado_inapp?: Json | null
          resultado_push?: Json | null
          segmento_tipo?: string
          segmento_valor?: string | null
          status?: string
          titulo?: string
        }
        Relationships: []
      }
      cargos_plataforma: {
        Row: {
          ativo: boolean
          criado_em: string
          criado_por: string
          descricao: string | null
          id: string
          nome: string
          permissoes: string[]
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          criado_em?: string
          criado_por: string
          descricao?: string | null
          id?: string
          nome: string
          permissoes?: string[]
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          criado_em?: string
          criado_por?: string
          descricao?: string | null
          id?: string
          nome?: string
          permissoes?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cargos_plataforma_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias_evento: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: string
          label: string
          ordem: number | null
          parent_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          label: string
          ordem?: number | null
          parent_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          label?: string
          ordem?: number | null
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categorias_evento_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categorias_evento"
            referencedColumns: ["id"]
          },
        ]
      }
      chargebacks: {
        Row: {
          criado_em: string
          evento_id: string
          gateway_ref: string
          id: string
          motivo: string | null
          status: string
          ticket_id: string
          valor: number
        }
        Insert: {
          criado_em?: string
          evento_id: string
          gateway_ref?: string
          id?: string
          motivo?: string | null
          status?: string
          ticket_id: string
          valor?: number
        }
        Update: {
          criado_em?: string
          evento_id?: string
          gateway_ref?: string
          id?: string
          motivo?: string | null
          status?: string
          ticket_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "chargebacks_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chargebacks_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets_caixa"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_settings: {
        Row: {
          archived: boolean
          archived_at: string | null
          id: string
          keep_archived: boolean
          muted: boolean
          partner_id: string
          user_id: string
        }
        Insert: {
          archived?: boolean
          archived_at?: string | null
          id?: string
          keep_archived?: boolean
          muted?: boolean
          partner_id: string
          user_id: string
        }
        Update: {
          archived?: boolean
          archived_at?: string | null
          id?: string
          keep_archived?: boolean
          muted?: boolean
          partner_id?: string
          user_id?: string
        }
        Relationships: []
      }
      cidades_mais_vanta: {
        Row: {
          ativo: boolean
          criado_em: string
          criado_por: string
          estado: string | null
          gerente_id: string | null
          id: string
          nome: string
          pais: string
        }
        Insert: {
          ativo?: boolean
          criado_em?: string
          criado_por: string
          estado?: string | null
          gerente_id?: string | null
          id?: string
          nome: string
          pais?: string
        }
        Update: {
          ativo?: boolean
          criado_em?: string
          criado_por?: string
          estado?: string | null
          gerente_id?: string | null
          id?: string
          nome?: string
          pais?: string
        }
        Relationships: [
          {
            foreignKeyName: "cidades_mais_vanta_gerente_id_fkey"
            columns: ["gerente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_config: {
        Row: {
          atualizado_em: string | null
          beneficios_bronze: string[] | null
          beneficios_diamante: string[] | null
          beneficios_ouro: string[] | null
          beneficios_prata: string[] | null
          beneficios_social: string[] | null
          bloqueio1_dias: number | null
          bloqueio2_dias: number | null
          comunidade_id: string
          convites_black: number
          convites_creator: number
          convites_lista: number
          convites_presenca: number
          convites_social: number
          deleted_at: string | null
          dias_castigo: number | null
          id: string
          infracoes_limite: number | null
          limite_bronze: number | null
          limite_diamante: number | null
          limite_ouro: number | null
          limite_prata: number | null
          limite_social: number | null
          prazo_post_horas: number | null
          stripe_connect_account_id: string | null
          stripe_connect_charges_enabled: boolean | null
          stripe_connect_onboarding_url: string | null
          stripe_connect_payouts_enabled: boolean | null
          stripe_connect_status: string | null
          stripe_connect_updated_at: string | null
        }
        Insert: {
          atualizado_em?: string | null
          beneficios_bronze?: string[] | null
          beneficios_diamante?: string[] | null
          beneficios_ouro?: string[] | null
          beneficios_prata?: string[] | null
          beneficios_social?: string[] | null
          bloqueio1_dias?: number | null
          bloqueio2_dias?: number | null
          comunidade_id: string
          convites_black?: number
          convites_creator?: number
          convites_lista?: number
          convites_presenca?: number
          convites_social?: number
          deleted_at?: string | null
          dias_castigo?: number | null
          id?: string
          infracoes_limite?: number | null
          limite_bronze?: number | null
          limite_diamante?: number | null
          limite_ouro?: number | null
          limite_prata?: number | null
          limite_social?: number | null
          prazo_post_horas?: number | null
          stripe_connect_account_id?: string | null
          stripe_connect_charges_enabled?: boolean | null
          stripe_connect_onboarding_url?: string | null
          stripe_connect_payouts_enabled?: boolean | null
          stripe_connect_status?: string | null
          stripe_connect_updated_at?: string | null
        }
        Update: {
          atualizado_em?: string | null
          beneficios_bronze?: string[] | null
          beneficios_diamante?: string[] | null
          beneficios_ouro?: string[] | null
          beneficios_prata?: string[] | null
          beneficios_social?: string[] | null
          bloqueio1_dias?: number | null
          bloqueio2_dias?: number | null
          comunidade_id?: string
          convites_black?: number
          convites_creator?: number
          convites_lista?: number
          convites_presenca?: number
          convites_social?: number
          deleted_at?: string | null
          dias_castigo?: number | null
          id?: string
          infracoes_limite?: number | null
          limite_bronze?: number | null
          limite_diamante?: number | null
          limite_ouro?: number | null
          limite_prata?: number | null
          limite_social?: number | null
          prazo_post_horas?: number | null
          stripe_connect_account_id?: string | null
          stripe_connect_charges_enabled?: boolean | null
          stripe_connect_onboarding_url?: string | null
          stripe_connect_payouts_enabled?: boolean | null
          stripe_connect_status?: string | null
          stripe_connect_updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clube_config_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: true
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clube_config_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: true
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clube_config_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: true
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clube_config_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: true
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "clube_config_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: true
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
        ]
      }
      comemoracoes: {
        Row: {
          avaliado_em: string | null
          avaliado_por: string | null
          celular: string
          comunidade_id: string
          created_at: string
          data_aniversario: string | null
          data_comemoracao: string
          deleted_at: string | null
          em_analise_em: string | null
          evento_id: string | null
          id: string
          instagram: string
          mensagem_gerente: string | null
          motivo: string
          motivo_outro: string | null
          motivo_recusa: string | null
          nome_completo: string
          ref_code: string | null
          solicitante_id: string
          status: string
          updated_at: string
          vendas_count: number
          visualizado_em: string | null
        }
        Insert: {
          avaliado_em?: string | null
          avaliado_por?: string | null
          celular: string
          comunidade_id: string
          created_at?: string
          data_aniversario?: string | null
          data_comemoracao: string
          deleted_at?: string | null
          em_analise_em?: string | null
          evento_id?: string | null
          id?: string
          instagram: string
          mensagem_gerente?: string | null
          motivo: string
          motivo_outro?: string | null
          motivo_recusa?: string | null
          nome_completo: string
          ref_code?: string | null
          solicitante_id: string
          status?: string
          updated_at?: string
          vendas_count?: number
          visualizado_em?: string | null
        }
        Update: {
          avaliado_em?: string | null
          avaliado_por?: string | null
          celular?: string
          comunidade_id?: string
          created_at?: string
          data_aniversario?: string | null
          data_comemoracao?: string
          deleted_at?: string | null
          em_analise_em?: string | null
          evento_id?: string | null
          id?: string
          instagram?: string
          mensagem_gerente?: string | null
          motivo?: string
          motivo_outro?: string | null
          motivo_recusa?: string | null
          nome_completo?: string
          ref_code?: string | null
          solicitante_id?: string
          status?: string
          updated_at?: string
          vendas_count?: number
          visualizado_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comemoracoes_avaliado_por_fkey"
            columns: ["avaliado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comemoracoes_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comemoracoes_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comemoracoes_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comemoracoes_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "comemoracoes_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "comemoracoes_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comemoracoes_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comemoracoes_config: {
        Row: {
          comunidade_id: string
          created_at: string
          datas_bloqueadas: Json | null
          deadline_hora: string | null
          deleted_at: string | null
          evento_id: string | null
          habilitado: boolean
          id: string
          limite_comemoracoes: number | null
          updated_at: string
        }
        Insert: {
          comunidade_id: string
          created_at?: string
          datas_bloqueadas?: Json | null
          deadline_hora?: string | null
          deleted_at?: string | null
          evento_id?: string | null
          habilitado?: boolean
          id?: string
          limite_comemoracoes?: number | null
          updated_at?: string
        }
        Update: {
          comunidade_id?: string
          created_at?: string
          datas_bloqueadas?: Json | null
          deadline_hora?: string | null
          deleted_at?: string | null
          evento_id?: string | null
          habilitado?: boolean
          id?: string
          limite_comemoracoes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comemoracoes_config_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comemoracoes_config_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comemoracoes_config_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comemoracoes_config_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "comemoracoes_config_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "comemoracoes_config_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: true
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
        ]
      }
      comemoracoes_cortesias: {
        Row: {
          celular_convidado: string | null
          comemoracao_id: string
          created_at: string
          faixa_id: string
          id: string
          nome_convidado: string | null
          resgatado: boolean
        }
        Insert: {
          celular_convidado?: string | null
          comemoracao_id: string
          created_at?: string
          faixa_id: string
          id?: string
          nome_convidado?: string | null
          resgatado?: boolean
        }
        Update: {
          celular_convidado?: string | null
          comemoracao_id?: string
          created_at?: string
          faixa_id?: string
          id?: string
          nome_convidado?: string | null
          resgatado?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "comemoracoes_cortesias_comemoracao_id_fkey"
            columns: ["comemoracao_id"]
            isOneToOne: false
            referencedRelation: "comemoracoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comemoracoes_cortesias_faixa_id_fkey"
            columns: ["faixa_id"]
            isOneToOne: false
            referencedRelation: "comemoracoes_faixas"
            referencedColumns: ["id"]
          },
        ]
      }
      comemoracoes_faixas: {
        Row: {
          beneficio_consumo: string | null
          config_id: string
          cortesias: number
          created_at: string
          deleted_at: string | null
          id: string
          min_vendas: number
          ordem: number
        }
        Insert: {
          beneficio_consumo?: string | null
          config_id: string
          cortesias?: number
          created_at?: string
          deleted_at?: string | null
          id?: string
          min_vendas: number
          ordem?: number
        }
        Update: {
          beneficio_consumo?: string | null
          config_id?: string
          cortesias?: number
          created_at?: string
          deleted_at?: string | null
          id?: string
          min_vendas?: number
          ordem?: number
        }
        Relationships: [
          {
            foreignKeyName: "comemoracoes_faixas_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "comemoracoes_config"
            referencedColumns: ["id"]
          },
        ]
      }
      community_follows: {
        Row: {
          comunidade_id: string
          created_at: string | null
          deleted_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          comunidade_id: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          comunidade_id?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_follows_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_follows_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_follows_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_follows_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "community_follows_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
        ]
      }
      comprovantes_meia: {
        Row: {
          aprovado_em: string | null
          aprovado_por: string | null
          atualizado_em: string
          criado_em: string
          deleted_at: string | null
          foto_url: string
          fotos: Json | null
          id: string
          motivo_rejeicao: string | null
          status: string
          tipo: string
          user_id: string
          validade_ate: string | null
        }
        Insert: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          atualizado_em?: string
          criado_em?: string
          deleted_at?: string | null
          foto_url: string
          fotos?: Json | null
          id?: string
          motivo_rejeicao?: string | null
          status?: string
          tipo: string
          user_id: string
          validade_ate?: string | null
        }
        Update: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          atualizado_em?: string
          criado_em?: string
          deleted_at?: string | null
          foto_url?: string
          fotos?: Json | null
          id?: string
          motivo_rejeicao?: string | null
          status?: string
          tipo?: string
          user_id?: string
          validade_ate?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comprovantes_meia_aprovado_por_fkey"
            columns: ["aprovado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comprovantes_meia_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comprovantes_meia_audit: {
        Row: {
          action: string
          actor_id: string | null
          comprovante_id: string
          created_at: string
          id: string
          snapshot_after: Json | null
          snapshot_before: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          comprovante_id: string
          created_at?: string
          id?: string
          snapshot_after?: Json | null
          snapshot_before?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          comprovante_id?: string
          created_at?: string
          id?: string
          snapshot_after?: Json | null
          snapshot_before?: Json | null
        }
        Relationships: []
      }
      comunidades: {
        Row: {
          ativa: boolean
          capacidade_max: number | null
          cargos_customizados: Json
          cep: string | null
          cidade: string
          cnpj: string | null
          condicoes_aceitas_em: string | null
          condicoes_status: string | null
          coords: Json | null
          cota_cortesias: number | null
          cota_nomes_lista: number | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          descricao: string
          dono_id: string | null
          endereco: string | null
          estado: string | null
          evento_privado_ativo: boolean | null
          evento_privado_atracoes: Json | null
          evento_privado_faixas_capacidade: Json | null
          evento_privado_formatos: Json | null
          evento_privado_fotos: Json | null
          evento_privado_texto: string | null
          foto: string | null
          foto_capa: string | null
          gateway_fee_mode: string
          horario_funcionamento: Json
          horario_overrides: Json
          id: string
          instagram: string | null
          limite_notificacoes_mes: number
          nome: string
          onboarding_completo: boolean | null
          razao_social: string | null
          site: string | null
          slug: string | null
          taxa_cortesia_excedente_pct: number | null
          taxa_minima: number | null
          taxa_nome_excedente: number | null
          taxa_porta_percent: number | null
          taxa_processamento_percent: number | null
          telefone: string | null
          tier_minimo_mais_vanta: string | null
          tiktok: string | null
          tipo_comunidade: string | null
          updated_at: string
          vanta_fee_fixed: number
          vanta_fee_percent: number | null
          vanta_fee_repasse_percent: number | null
          whatsapp: string | null
        }
        Insert: {
          ativa?: boolean
          capacidade_max?: number | null
          cargos_customizados?: Json
          cep?: string | null
          cidade?: string
          cnpj?: string | null
          condicoes_aceitas_em?: string | null
          condicoes_status?: string | null
          coords?: Json | null
          cota_cortesias?: number | null
          cota_nomes_lista?: number | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          descricao?: string
          dono_id?: string | null
          endereco?: string | null
          estado?: string | null
          evento_privado_ativo?: boolean | null
          evento_privado_atracoes?: Json | null
          evento_privado_faixas_capacidade?: Json | null
          evento_privado_formatos?: Json | null
          evento_privado_fotos?: Json | null
          evento_privado_texto?: string | null
          foto?: string | null
          foto_capa?: string | null
          gateway_fee_mode?: string
          horario_funcionamento?: Json
          horario_overrides?: Json
          id?: string
          instagram?: string | null
          limite_notificacoes_mes?: number
          nome: string
          onboarding_completo?: boolean | null
          razao_social?: string | null
          site?: string | null
          slug?: string | null
          taxa_cortesia_excedente_pct?: number | null
          taxa_minima?: number | null
          taxa_nome_excedente?: number | null
          taxa_porta_percent?: number | null
          taxa_processamento_percent?: number | null
          telefone?: string | null
          tier_minimo_mais_vanta?: string | null
          tiktok?: string | null
          tipo_comunidade?: string | null
          updated_at?: string
          vanta_fee_fixed?: number
          vanta_fee_percent?: number | null
          vanta_fee_repasse_percent?: number | null
          whatsapp?: string | null
        }
        Update: {
          ativa?: boolean
          capacidade_max?: number | null
          cargos_customizados?: Json
          cep?: string | null
          cidade?: string
          cnpj?: string | null
          condicoes_aceitas_em?: string | null
          condicoes_status?: string | null
          coords?: Json | null
          cota_cortesias?: number | null
          cota_nomes_lista?: number | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          descricao?: string
          dono_id?: string | null
          endereco?: string | null
          estado?: string | null
          evento_privado_ativo?: boolean | null
          evento_privado_atracoes?: Json | null
          evento_privado_faixas_capacidade?: Json | null
          evento_privado_formatos?: Json | null
          evento_privado_fotos?: Json | null
          evento_privado_texto?: string | null
          foto?: string | null
          foto_capa?: string | null
          gateway_fee_mode?: string
          horario_funcionamento?: Json
          horario_overrides?: Json
          id?: string
          instagram?: string | null
          limite_notificacoes_mes?: number
          nome?: string
          onboarding_completo?: boolean | null
          razao_social?: string | null
          site?: string | null
          slug?: string | null
          taxa_cortesia_excedente_pct?: number | null
          taxa_minima?: number | null
          taxa_nome_excedente?: number | null
          taxa_porta_percent?: number | null
          taxa_processamento_percent?: number | null
          telefone?: string | null
          tier_minimo_mais_vanta?: string | null
          tiktok?: string | null
          tipo_comunidade?: string | null
          updated_at?: string
          vanta_fee_fixed?: number
          vanta_fee_percent?: number | null
          vanta_fee_repasse_percent?: number | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      condicoes_comerciais: {
        Row: {
          aceito_em: string | null
          aceito_por: string | null
          comunidade_id: string | null
          cota_cortesias: number | null
          cota_nomes_lista: number | null
          created_at: string
          definido_em: string
          definido_por: string
          expira_em: string
          id: string
          motivo_recusa: string | null
          observacoes: string | null
          prazo_pagamento_dias: number | null
          quem_paga_servico: string | null
          status: string
          taxa_cortesia_excedente_pct: number | null
          taxa_fixa_evento: number | null
          taxa_minima: number | null
          taxa_nome_excedente: number | null
          taxa_porta_percent: number | null
          taxa_processamento_percent: number | null
          taxa_servico_percent: number | null
        }
        Insert: {
          aceito_em?: string | null
          aceito_por?: string | null
          comunidade_id?: string | null
          cota_cortesias?: number | null
          cota_nomes_lista?: number | null
          created_at?: string
          definido_em?: string
          definido_por: string
          expira_em?: string
          id?: string
          motivo_recusa?: string | null
          observacoes?: string | null
          prazo_pagamento_dias?: number | null
          quem_paga_servico?: string | null
          status?: string
          taxa_cortesia_excedente_pct?: number | null
          taxa_fixa_evento?: number | null
          taxa_minima?: number | null
          taxa_nome_excedente?: number | null
          taxa_porta_percent?: number | null
          taxa_processamento_percent?: number | null
          taxa_servico_percent?: number | null
        }
        Update: {
          aceito_em?: string | null
          aceito_por?: string | null
          comunidade_id?: string | null
          cota_cortesias?: number | null
          cota_nomes_lista?: number | null
          created_at?: string
          definido_em?: string
          definido_por?: string
          expira_em?: string
          id?: string
          motivo_recusa?: string | null
          observacoes?: string | null
          prazo_pagamento_dias?: number | null
          quem_paga_servico?: string | null
          status?: string
          taxa_cortesia_excedente_pct?: number | null
          taxa_fixa_evento?: number | null
          taxa_minima?: number | null
          taxa_nome_excedente?: number | null
          taxa_porta_percent?: number | null
          taxa_processamento_percent?: number | null
          taxa_servico_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "condicoes_comerciais_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "condicoes_comerciais_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "condicoes_comerciais_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "condicoes_comerciais_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "condicoes_comerciais_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
        ]
      }
      connect_events_log: {
        Row: {
          account_id: string
          comunidade_id: string | null
          event_id: string
          event_type: string
          id: string
          payload: Json | null
          processado_em: string
        }
        Insert: {
          account_id: string
          comunidade_id?: string | null
          event_id: string
          event_type: string
          id?: string
          payload?: Json | null
          processado_em?: string
        }
        Update: {
          account_id?: string
          comunidade_id?: string | null
          event_id?: string
          event_type?: string
          id?: string
          payload?: Json | null
          processado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "connect_events_log_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_events_log_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_events_log_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_events_log_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "connect_events_log_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
        ]
      }
      convidados_lista: {
        Row: {
          checked_in: boolean
          checked_in_em: string | null
          checked_in_por_id: string | null
          checked_in_por_nome: string | null
          created_at: string
          deleted_at: string | null
          forma_pagamento: string | null
          id: string
          inserido_por: string | null
          inserido_por_nome: string | null
          lista_id: string
          nome: string
          observacao: string | null
          regra_id: string
          telefone: string | null
          validado_por_nome: string | null
        }
        Insert: {
          checked_in?: boolean
          checked_in_em?: string | null
          checked_in_por_id?: string | null
          checked_in_por_nome?: string | null
          created_at?: string
          deleted_at?: string | null
          forma_pagamento?: string | null
          id?: string
          inserido_por?: string | null
          inserido_por_nome?: string | null
          lista_id: string
          nome: string
          observacao?: string | null
          regra_id: string
          telefone?: string | null
          validado_por_nome?: string | null
        }
        Update: {
          checked_in?: boolean
          checked_in_em?: string | null
          checked_in_por_id?: string | null
          checked_in_por_nome?: string | null
          created_at?: string
          deleted_at?: string | null
          forma_pagamento?: string | null
          id?: string
          inserido_por?: string | null
          inserido_por_nome?: string | null
          lista_id?: string
          nome?: string
          observacao?: string | null
          regra_id?: string
          telefone?: string | null
          validado_por_nome?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "convidados_lista_lista_id_fkey"
            columns: ["lista_id"]
            isOneToOne: false
            referencedRelation: "listas_evento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convidados_lista_regra_id_fkey"
            columns: ["regra_id"]
            isOneToOne: false
            referencedRelation: "regras_lista"
            referencedColumns: ["id"]
          },
        ]
      }
      convites_clube: {
        Row: {
          codigo: string
          criado_em: string
          id: string
          membro_id: string
          status: string
          usado_em: string | null
          usado_por: string | null
        }
        Insert: {
          codigo?: string
          criado_em?: string
          id?: string
          membro_id: string
          status?: string
          usado_em?: string | null
          usado_por?: string | null
        }
        Update: {
          codigo?: string
          criado_em?: string
          id?: string
          membro_id?: string
          status?: string
          usado_em?: string | null
          usado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "convites_clube_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convites_clube_usado_por_fkey"
            columns: ["usado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      convites_mais_vanta: {
        Row: {
          aceito_em: string | null
          aceito_por: string | null
          cidade_id: string | null
          criado_em: string
          criado_por: string
          expira_em: string
          id: string
          parceiro_nome: string | null
          status: string
          tier: string | null
          tipo: string
          token: string
        }
        Insert: {
          aceito_em?: string | null
          aceito_por?: string | null
          cidade_id?: string | null
          criado_em?: string
          criado_por: string
          expira_em?: string
          id?: string
          parceiro_nome?: string | null
          status?: string
          tier?: string | null
          tipo: string
          token?: string
        }
        Update: {
          aceito_em?: string | null
          aceito_por?: string | null
          cidade_id?: string | null
          criado_em?: string
          criado_por?: string
          expira_em?: string
          id?: string
          parceiro_nome?: string | null
          status?: string
          tier?: string | null
          tipo?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "convites_mais_vanta_aceito_por_fkey"
            columns: ["aceito_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convites_mais_vanta_cidade_id_fkey"
            columns: ["cidade_id"]
            isOneToOne: false
            referencedRelation: "cidades_mais_vanta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convites_mais_vanta_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cortesias_config: {
        Row: {
          created_at: string
          deleted_at: string | null
          evento_id: string
          id: string
          limite: number
          limites_por_tipo: Json | null
          lista_id: string | null
          variacoes: string[]
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          evento_id: string
          id?: string
          limite?: number
          limites_por_tipo?: Json | null
          lista_id?: string | null
          variacoes?: string[]
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          evento_id?: string
          id?: string
          limite?: number
          limites_por_tipo?: Json | null
          lista_id?: string | null
          variacoes?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "cortesias_config_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: true
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
        ]
      }
      cortesias_log: {
        Row: {
          created_at: string
          destinatario_nome: string
          evento_id: string | null
          id: string
          quantidade: number
          remetente_nome: string
          variacao_label: string
        }
        Insert: {
          created_at?: string
          destinatario_nome?: string
          evento_id?: string | null
          id?: string
          quantidade?: number
          remetente_nome?: string
          variacao_label?: string
        }
        Update: {
          created_at?: string
          destinatario_nome?: string
          evento_id?: string | null
          id?: string
          quantidade?: number
          remetente_nome?: string
          variacao_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "cortesias_log_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
        ]
      }
      cortesias_pendentes: {
        Row: {
          created_at: string | null
          delegado_por: string | null
          destinatario_id: string
          evento_data: string | null
          evento_id: string
          evento_nome: string | null
          id: string
          nome_convidado: string | null
          quantidade: number | null
          remetente_nome: string | null
          status: string | null
          variacao_label: string | null
        }
        Insert: {
          created_at?: string | null
          delegado_por?: string | null
          destinatario_id: string
          evento_data?: string | null
          evento_id: string
          evento_nome?: string | null
          id?: string
          nome_convidado?: string | null
          quantidade?: number | null
          remetente_nome?: string | null
          status?: string | null
          variacao_label?: string | null
        }
        Update: {
          created_at?: string | null
          delegado_por?: string | null
          destinatario_id?: string
          evento_data?: string | null
          evento_id?: string
          evento_nome?: string | null
          id?: string
          nome_convidado?: string | null
          quantidade?: number | null
          remetente_nome?: string | null
          status?: string | null
          variacao_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cortesias_pendentes_delegado_por_fkey"
            columns: ["delegado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cotas_promoter: {
        Row: {
          alocado: number
          comissao_tipo: string | null
          comissao_valor: number | null
          created_at: string
          deleted_at: string | null
          id: string
          lista_id: string
          promoter_id: string
          regra_id: string
          usado: number
        }
        Insert: {
          alocado?: number
          comissao_tipo?: string | null
          comissao_valor?: number | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          lista_id: string
          promoter_id: string
          regra_id: string
          usado?: number
        }
        Update: {
          alocado?: number
          comissao_tipo?: string | null
          comissao_valor?: number | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          lista_id?: string
          promoter_id?: string
          regra_id?: string
          usado?: number
        }
        Relationships: [
          {
            foreignKeyName: "cotas_promoter_lista_id_fkey"
            columns: ["lista_id"]
            isOneToOne: false
            referencedRelation: "listas_evento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cotas_promoter_regra_id_fkey"
            columns: ["regra_id"]
            isOneToOne: false
            referencedRelation: "regras_lista"
            referencedColumns: ["id"]
          },
        ]
      }
      cupons: {
        Row: {
          ativo: boolean
          codigo: string
          comunidade_id: string | null
          criado_em: string
          criado_por: string
          deleted_at: string | null
          evento_id: string | null
          id: string
          limite_usos: number | null
          tipo: string
          usos: number
          valido_ate: string | null
          valor: number
        }
        Insert: {
          ativo?: boolean
          codigo: string
          comunidade_id?: string | null
          criado_em?: string
          criado_por: string
          deleted_at?: string | null
          evento_id?: string | null
          id?: string
          limite_usos?: number | null
          tipo?: string
          usos?: number
          valido_ate?: string | null
          valor?: number
        }
        Update: {
          ativo?: boolean
          codigo?: string
          comunidade_id?: string | null
          criado_em?: string
          criado_por?: string
          deleted_at?: string | null
          evento_id?: string | null
          id?: string
          limite_usos?: number | null
          tipo?: string
          usos?: number
          valido_ate?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "cupons_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cupons_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cupons_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cupons_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "cupons_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "cupons_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
        ]
      }
      deals_mais_vanta: {
        Row: {
          atualizado_em: string | null
          cidade_id: string
          criado_em: string
          deleted_at: string | null
          desconto_percentual: number | null
          desconto_valor: number | null
          descricao: string | null
          filtro_alcance: string[] | null
          filtro_categoria: string[] | null
          filtro_genero: string | null
          fim: string | null
          foto_url: string | null
          id: string
          inicio: string
          obrigacao_barter: string | null
          parceiro_id: string
          status: string
          tipo: string
          titulo: string
          vagas: number
          vagas_preenchidas: number
        }
        Insert: {
          atualizado_em?: string | null
          cidade_id: string
          criado_em?: string
          deleted_at?: string | null
          desconto_percentual?: number | null
          desconto_valor?: number | null
          descricao?: string | null
          filtro_alcance?: string[] | null
          filtro_categoria?: string[] | null
          filtro_genero?: string | null
          fim?: string | null
          foto_url?: string | null
          id?: string
          inicio?: string
          obrigacao_barter?: string | null
          parceiro_id: string
          status?: string
          tipo: string
          titulo: string
          vagas?: number
          vagas_preenchidas?: number
        }
        Update: {
          atualizado_em?: string | null
          cidade_id?: string
          criado_em?: string
          deleted_at?: string | null
          desconto_percentual?: number | null
          desconto_valor?: number | null
          descricao?: string | null
          filtro_alcance?: string[] | null
          filtro_categoria?: string[] | null
          filtro_genero?: string | null
          fim?: string | null
          foto_url?: string | null
          id?: string
          inicio?: string
          obrigacao_barter?: string | null
          parceiro_id?: string
          status?: string
          tipo?: string
          titulo?: string
          vagas?: number
          vagas_preenchidas?: number
        }
        Relationships: [
          {
            foreignKeyName: "deals_mais_vanta_cidade_id_fkey"
            columns: ["cidade_id"]
            isOneToOne: false
            referencedRelation: "cidades_mais_vanta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_mais_vanta_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros_mais_vanta"
            referencedColumns: ["id"]
          },
        ]
      }
      denuncias: {
        Row: {
          alvo_comunidade_id: string | null
          alvo_evento_id: string | null
          alvo_user_id: string | null
          atualizado_em: string | null
          criado_em: string
          descricao: string | null
          id: string
          motivo: string
          reporter_id: string
          status: string
          tipo: string
        }
        Insert: {
          alvo_comunidade_id?: string | null
          alvo_evento_id?: string | null
          alvo_user_id?: string | null
          atualizado_em?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          motivo: string
          reporter_id: string
          status?: string
          tipo: string
        }
        Update: {
          alvo_comunidade_id?: string | null
          alvo_evento_id?: string | null
          alvo_user_id?: string | null
          atualizado_em?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          motivo?: string
          reporter_id?: string
          status?: string
          tipo?: string
        }
        Relationships: []
      }
      drafts: {
        Row: {
          comunidade_id: string | null
          created_at: string
          dados: Json
          deleted_at: string | null
          expires_at: string
          foto_temp_url: string | null
          id: string
          step_atual: number
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comunidade_id?: string | null
          created_at?: string
          dados?: Json
          deleted_at?: string | null
          expires_at?: string
          foto_temp_url?: string | null
          id?: string
          step_atual?: number
          tipo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comunidade_id?: string | null
          created_at?: string
          dados?: Json
          deleted_at?: string | null
          expires_at?: string
          foto_temp_url?: string | null
          id?: string
          step_atual?: number
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drafts_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drafts_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drafts_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drafts_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "drafts_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
        ]
      }
      equipe_evento: {
        Row: {
          created_at: string
          deleted_at: string | null
          evento_id: string
          id: string
          liberar_lista: boolean
          membro_id: string
          papel: string
          permissoes: string[] | null
          pode_inserir_lista: boolean | null
          variacoes_permitidas: string[] | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          evento_id: string
          id?: string
          liberar_lista?: boolean
          membro_id: string
          papel: string
          permissoes?: string[] | null
          pode_inserir_lista?: boolean | null
          variacoes_permitidas?: string[] | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          evento_id?: string
          id?: string
          liberar_lista?: boolean
          membro_id?: string
          papel?: string
          permissoes?: string[] | null
          pode_inserir_lista?: boolean | null
          variacoes_permitidas?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "equipe_evento_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
        ]
      }
      estilos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          deleted_at: string | null
          id: string
          label: string
          ordem: number | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          label: string
          ordem?: number | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          label?: string
          ordem?: number | null
        }
        Relationships: []
      }
      evento_favoritos: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          evento_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          evento_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          evento_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evento_favoritos_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos_admin: {
        Row: {
          caixa_ativo: boolean
          cancelamento_etapa: string | null
          cancelamento_motivo: string | null
          cancelamento_solicitado_por: string | null
          categoria: string | null
          cidade: string | null
          classificacao_etaria: string
          codigo_afiliado: string | null
          comissao_vanta: number | null
          comunidade_id: string | null
          coords: Json | null
          cota_cortesias: number | null
          cota_nomes_lista: number | null
          created_at: string
          created_by: string | null
          custos_fixos: number | null
          data_fim: string | null
          data_inicio: string
          deleted_at: string | null
          descricao: string
          edicao_motivo: string | null
          edicao_pendente: Json | null
          edicao_status: string | null
          endereco: string | null
          estilos: string[] | null
          evento_origem_id: string | null
          experiencias: string[] | null
          formato: string | null
          foto: string | null
          gateway_fee_mode: string
          id: string
          idade_minima: number | null
          link_externo: string | null
          local: string
          mesas_ativo: boolean | null
          motivo_rejeicao: string | null
          mv_avaliacao: string | null
          nome: string
          permissoes_produtor: string[] | null
          planta_mesas: string | null
          plataforma_externa: string | null
          politica_reembolso: string | null
          prazo_pagamento_dias: number | null
          prazo_reembolso_dias: number | null
          proposta_mensagem: string | null
          proposta_rodada: number | null
          proposta_status: string | null
          publicado: boolean
          quem_paga_servico: string | null
          recorrencia: string
          recorrencia_ate: string | null
          rejeicao_campos: Json | null
          rodada_negociacao: number | null
          rodada_rejeicao: number | null
          slug: string | null
          socio_convidado_id: string | null
          split_produtor: number | null
          split_socio: number | null
          status_evento: string | null
          subcategorias: string[] | null
          taxa_cortesia_excedente_pct: number | null
          taxa_fixa_evento: number | null
          taxa_minima: number | null
          taxa_nome_excedente: number | null
          taxa_override: number | null
          taxa_porta_percent: number | null
          taxa_processamento_percent: number | null
          tipo_fluxo: string | null
          updated_at: string
          vanta_fee_fixed: number
          vanta_fee_percent: number | null
          venda_vanta: boolean | null
        }
        Insert: {
          caixa_ativo?: boolean
          cancelamento_etapa?: string | null
          cancelamento_motivo?: string | null
          cancelamento_solicitado_por?: string | null
          categoria?: string | null
          cidade?: string | null
          classificacao_etaria?: string
          codigo_afiliado?: string | null
          comissao_vanta?: number | null
          comunidade_id?: string | null
          coords?: Json | null
          cota_cortesias?: number | null
          cota_nomes_lista?: number | null
          created_at?: string
          created_by?: string | null
          custos_fixos?: number | null
          data_fim?: string | null
          data_inicio: string
          deleted_at?: string | null
          descricao?: string
          edicao_motivo?: string | null
          edicao_pendente?: Json | null
          edicao_status?: string | null
          endereco?: string | null
          estilos?: string[] | null
          evento_origem_id?: string | null
          experiencias?: string[] | null
          formato?: string | null
          foto?: string | null
          gateway_fee_mode?: string
          id?: string
          idade_minima?: number | null
          link_externo?: string | null
          local?: string
          mesas_ativo?: boolean | null
          motivo_rejeicao?: string | null
          mv_avaliacao?: string | null
          nome: string
          permissoes_produtor?: string[] | null
          planta_mesas?: string | null
          plataforma_externa?: string | null
          politica_reembolso?: string | null
          prazo_pagamento_dias?: number | null
          prazo_reembolso_dias?: number | null
          proposta_mensagem?: string | null
          proposta_rodada?: number | null
          proposta_status?: string | null
          publicado?: boolean
          quem_paga_servico?: string | null
          recorrencia?: string
          recorrencia_ate?: string | null
          rejeicao_campos?: Json | null
          rodada_negociacao?: number | null
          rodada_rejeicao?: number | null
          slug?: string | null
          socio_convidado_id?: string | null
          split_produtor?: number | null
          split_socio?: number | null
          status_evento?: string | null
          subcategorias?: string[] | null
          taxa_cortesia_excedente_pct?: number | null
          taxa_fixa_evento?: number | null
          taxa_minima?: number | null
          taxa_nome_excedente?: number | null
          taxa_override?: number | null
          taxa_porta_percent?: number | null
          taxa_processamento_percent?: number | null
          tipo_fluxo?: string | null
          updated_at?: string
          vanta_fee_fixed?: number
          vanta_fee_percent?: number | null
          venda_vanta?: boolean | null
        }
        Update: {
          caixa_ativo?: boolean
          cancelamento_etapa?: string | null
          cancelamento_motivo?: string | null
          cancelamento_solicitado_por?: string | null
          categoria?: string | null
          cidade?: string | null
          classificacao_etaria?: string
          codigo_afiliado?: string | null
          comissao_vanta?: number | null
          comunidade_id?: string | null
          coords?: Json | null
          cota_cortesias?: number | null
          cota_nomes_lista?: number | null
          created_at?: string
          created_by?: string | null
          custos_fixos?: number | null
          data_fim?: string | null
          data_inicio?: string
          deleted_at?: string | null
          descricao?: string
          edicao_motivo?: string | null
          edicao_pendente?: Json | null
          edicao_status?: string | null
          endereco?: string | null
          estilos?: string[] | null
          evento_origem_id?: string | null
          experiencias?: string[] | null
          formato?: string | null
          foto?: string | null
          gateway_fee_mode?: string
          id?: string
          idade_minima?: number | null
          link_externo?: string | null
          local?: string
          mesas_ativo?: boolean | null
          motivo_rejeicao?: string | null
          mv_avaliacao?: string | null
          nome?: string
          permissoes_produtor?: string[] | null
          planta_mesas?: string | null
          plataforma_externa?: string | null
          politica_reembolso?: string | null
          prazo_pagamento_dias?: number | null
          prazo_reembolso_dias?: number | null
          proposta_mensagem?: string | null
          proposta_rodada?: number | null
          proposta_status?: string | null
          publicado?: boolean
          quem_paga_servico?: string | null
          recorrencia?: string
          recorrencia_ate?: string | null
          rejeicao_campos?: Json | null
          rodada_negociacao?: number | null
          rodada_rejeicao?: number | null
          slug?: string | null
          socio_convidado_id?: string | null
          split_produtor?: number | null
          split_socio?: number | null
          status_evento?: string | null
          subcategorias?: string[] | null
          taxa_cortesia_excedente_pct?: number | null
          taxa_fixa_evento?: number | null
          taxa_minima?: number | null
          taxa_nome_excedente?: number | null
          taxa_override?: number | null
          taxa_porta_percent?: number | null
          taxa_processamento_percent?: number | null
          tipo_fluxo?: string | null
          updated_at?: string
          vanta_fee_fixed?: number
          vanta_fee_percent?: number | null
          venda_vanta?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_admin_cancelamento_solicitado_por_fkey"
            columns: ["cancelamento_solicitado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_admin_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_admin_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_admin_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_admin_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "eventos_admin_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "eventos_admin_evento_origem_id_fkey"
            columns: ["evento_origem_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos_privados: {
        Row: {
          atracoes: Json
          avaliado_em: string | null
          avaliado_por: string | null
          comunidade_id: string
          created_at: string
          data_estimativa: string | null
          data_evento: string | null
          deleted_at: string | null
          descricao: string
          em_analise_em: string | null
          email: string
          empresa: string
          evento_id: string | null
          faixa_capacidade: string
          formatos: Json
          horario: string
          id: string
          instagram: string
          mensagem_gerente: string | null
          motivo_recusa: string | null
          nome_completo: string
          solicitante_id: string
          status: string
          telefone: string
          updated_at: string
          visualizado_em: string | null
        }
        Insert: {
          atracoes?: Json
          avaliado_em?: string | null
          avaliado_por?: string | null
          comunidade_id: string
          created_at?: string
          data_estimativa?: string | null
          data_evento?: string | null
          deleted_at?: string | null
          descricao: string
          em_analise_em?: string | null
          email: string
          empresa: string
          evento_id?: string | null
          faixa_capacidade: string
          formatos?: Json
          horario: string
          id?: string
          instagram: string
          mensagem_gerente?: string | null
          motivo_recusa?: string | null
          nome_completo: string
          solicitante_id: string
          status?: string
          telefone: string
          updated_at?: string
          visualizado_em?: string | null
        }
        Update: {
          atracoes?: Json
          avaliado_em?: string | null
          avaliado_por?: string | null
          comunidade_id?: string
          created_at?: string
          data_estimativa?: string | null
          data_evento?: string | null
          deleted_at?: string | null
          descricao?: string
          em_analise_em?: string | null
          email?: string
          empresa?: string
          evento_id?: string | null
          faixa_capacidade?: string
          formatos?: Json
          horario?: string
          id?: string
          instagram?: string
          mensagem_gerente?: string | null
          motivo_recusa?: string | null
          nome_completo?: string
          solicitante_id?: string
          status?: string
          telefone?: string
          updated_at?: string
          visualizado_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_privados_avaliado_por_fkey"
            columns: ["avaliado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_privados_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_privados_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_privados_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_privados_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "eventos_privados_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "eventos_privados_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_privados_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      experiencias: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          deleted_at: string | null
          id: string
          label: string
          ordem: number | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          label: string
          ordem?: number | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          label?: string
          ordem?: number | null
        }
        Relationships: []
      }
      fidelidade_cliente: {
        Row: {
          atualizado_em: string | null
          comunidade_id: string | null
          id: string
          pontos: number | null
          tier: string | null
          ultimo_evento_id: string | null
          user_id: string | null
        }
        Insert: {
          atualizado_em?: string | null
          comunidade_id?: string | null
          id?: string
          pontos?: number | null
          tier?: string | null
          ultimo_evento_id?: string | null
          user_id?: string | null
        }
        Update: {
          atualizado_em?: string | null
          comunidade_id?: string | null
          id?: string
          pontos?: number | null
          tier?: string | null
          ultimo_evento_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fidelidade_cliente_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fidelidade_cliente_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fidelidade_cliente_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fidelidade_cliente_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "fidelidade_cliente_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "fidelidade_cliente_ultimo_evento_id_fkey"
            columns: ["ultimo_evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fidelidade_cliente_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      formatos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          deleted_at: string | null
          id: string
          label: string
          ordem: number | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          label: string
          ordem?: number | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          label?: string
          ordem?: number | null
        }
        Relationships: []
      }
      friendships: {
        Row: {
          addressee_id: string
          created_at: string
          deleted_at: string | null
          id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      historico_ciclos_mv: {
        Row: {
          alcance_estimado: number
          assinatura_id: string | null
          ciclo_fim: string
          ciclo_inicio: string
          ciclo_numero: number
          eventos_ativados_count: number
          id: string
          passes_iniciais: number
          passes_usados: number
          resgates_total: number
          snapshot_at: string
        }
        Insert: {
          alcance_estimado?: number
          assinatura_id?: string | null
          ciclo_fim: string
          ciclo_inicio: string
          ciclo_numero: number
          eventos_ativados_count?: number
          id?: string
          passes_iniciais: number
          passes_usados: number
          resgates_total?: number
          snapshot_at?: string
        }
        Update: {
          alcance_estimado?: number
          assinatura_id?: string | null
          ciclo_fim?: string
          ciclo_inicio?: string
          ciclo_numero?: number
          eventos_ativados_count?: number
          id?: string
          passes_iniciais?: number
          passes_usados?: number
          resgates_total?: number
          snapshot_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_ciclos_mv_assinatura_id_fkey"
            columns: ["assinatura_id"]
            isOneToOne: false
            referencedRelation: "assinaturas_mais_vanta"
            referencedColumns: ["id"]
          },
        ]
      }
      hq_audit_log: {
        Row: {
          action: string
          created_at: string
          id: number
          payload: string | null
          result: string | null
          user_email: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: never
          payload?: string | null
          result?: string | null
          user_email?: string
          user_id?: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: never
          payload?: string | null
          result?: string | null
          user_email?: string
          user_id?: string
        }
        Relationships: []
      }
      hq_state: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      hq_vencimentos: {
        Row: {
          alerta_dias: number[] | null
          ativo: boolean | null
          created_at: string | null
          custo_anual: number | null
          custo_mensal: number | null
          data_renovacao: string | null
          id: string
          moeda: string | null
          notas: string | null
          pago_ate: string | null
          plano: string | null
          service: string
          tipo: string | null
          updated_at: string | null
        }
        Insert: {
          alerta_dias?: number[] | null
          ativo?: boolean | null
          created_at?: string | null
          custo_anual?: number | null
          custo_mensal?: number | null
          data_renovacao?: string | null
          id?: string
          moeda?: string | null
          notas?: string | null
          pago_ate?: string | null
          plano?: string | null
          service: string
          tipo?: string | null
          updated_at?: string | null
        }
        Update: {
          alerta_dias?: number[] | null
          ativo?: boolean | null
          created_at?: string | null
          custo_anual?: number | null
          custo_mensal?: number | null
          data_renovacao?: string | null
          id?: string
          moeda?: string | null
          notas?: string | null
          pago_ate?: string | null
          plano?: string | null
          service?: string
          tipo?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      infracoes_mais_vanta: {
        Row: {
          criado_em: string | null
          criado_por: string | null
          deleted_at: string | null
          evento_id: string | null
          evento_nome: string | null
          id: string
          tipo: string
          user_id: string
        }
        Insert: {
          criado_em?: string | null
          criado_por?: string | null
          deleted_at?: string | null
          evento_id?: string | null
          evento_nome?: string | null
          id?: string
          tipo: string
          user_id: string
        }
        Update: {
          criado_em?: string | null
          criado_por?: string | null
          deleted_at?: string | null
          evento_id?: string | null
          evento_nome?: string | null
          id?: string
          tipo?: string
          user_id?: string
        }
        Relationships: []
      }
      interesses: {
        Row: {
          ativo: boolean
          created_at: string | null
          icone: string
          id: string
          label: string
          ordem: number
        }
        Insert: {
          ativo?: boolean
          created_at?: string | null
          icone?: string
          id?: string
          label: string
          ordem?: number
        }
        Update: {
          ativo?: boolean
          created_at?: string | null
          icone?: string
          id?: string
          label?: string
          ordem?: number
        }
        Relationships: []
      }
      legal_documents: {
        Row: {
          checksum: string | null
          conteudo: string
          criado_em: string | null
          criado_por: string | null
          id: string
          publicado: boolean | null
          publicado_em: string | null
          publicado_por: string | null
          tipo: string
          versao: number
        }
        Insert: {
          checksum?: string | null
          conteudo?: string
          criado_em?: string | null
          criado_por?: string | null
          id?: string
          publicado?: boolean | null
          publicado_em?: string | null
          publicado_por?: string | null
          tipo: string
          versao?: number
        }
        Update: {
          checksum?: string | null
          conteudo?: string
          criado_em?: string | null
          criado_por?: string | null
          id?: string
          publicado?: boolean | null
          publicado_em?: string | null
          publicado_por?: string | null
          tipo?: string
          versao?: number
        }
        Relationships: [
          {
            foreignKeyName: "legal_documents_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "legal_documents_publicado_por_fkey"
            columns: ["publicado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lgpd_export_audit: {
        Row: {
          exported_at: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          exported_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          exported_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      listas_evento: {
        Row: {
          created_at: string
          deleted_at: string | null
          evento_id: string
          id: string
          teto_global_total: number | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          evento_id: string
          id?: string
          teto_global_total?: number | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          evento_id?: string
          id?: string
          teto_global_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listas_evento_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
        ]
      }
      lotes: {
        Row: {
          ativo: boolean
          created_at: string
          data_validade: string | null
          deleted_at: string | null
          evento_id: string
          id: string
          nome: string
          ordem: number
          virar_pct: number | null
          visibilidade: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          data_validade?: string | null
          deleted_at?: string | null
          evento_id: string
          id?: string
          nome: string
          ordem?: number
          virar_pct?: number | null
          visibilidade?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          data_validade?: string | null
          deleted_at?: string | null
          evento_id?: string
          id?: string
          nome?: string
          ordem?: number
          virar_pct?: number | null
          visibilidade?: string
        }
        Relationships: [
          {
            foreignKeyName: "lotes_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
        ]
      }
      mais_vanta_aplicacoes: {
        Row: {
          cidade: string
          created_at: string
          email: string
          id: string
          instagram: string
          motivo: string
          nome: string
          status: string
          updated_at: string
        }
        Insert: {
          cidade: string
          created_at?: string
          email: string
          id?: string
          instagram: string
          motivo: string
          nome: string
          status?: string
          updated_at?: string
        }
        Update: {
          cidade?: string
          created_at?: string
          email?: string
          id?: string
          instagram?: string
          motivo?: string
          nome?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      mais_vanta_config: {
        Row: {
          atualizado_em: string | null
          atualizado_por: string | null
          beneficios_disponiveis: Json
          bloqueio1_dias: number
          bloqueio2_dias: number
          descricao_programa: string
          email_contato: string
          hashtags_obrigatorias: string[]
          id: string
          infracoes_limite: number
          mencoes_obrigatorias: string[]
          nome_programa: string
          prazo_post_horas: number
          termos_customizados: string | null
          vantagens_membro: Json
          vantagens_venue: Json
        }
        Insert: {
          atualizado_em?: string | null
          atualizado_por?: string | null
          beneficios_disponiveis?: Json
          bloqueio1_dias?: number
          bloqueio2_dias?: number
          descricao_programa?: string
          email_contato?: string
          hashtags_obrigatorias?: string[]
          id?: string
          infracoes_limite?: number
          mencoes_obrigatorias?: string[]
          nome_programa?: string
          prazo_post_horas?: number
          termos_customizados?: string | null
          vantagens_membro?: Json
          vantagens_venue?: Json
        }
        Update: {
          atualizado_em?: string | null
          atualizado_por?: string | null
          beneficios_disponiveis?: Json
          bloqueio1_dias?: number
          bloqueio2_dias?: number
          descricao_programa?: string
          email_contato?: string
          hashtags_obrigatorias?: string[]
          id?: string
          infracoes_limite?: number
          mencoes_obrigatorias?: string[]
          nome_programa?: string
          prazo_post_horas?: number
          termos_customizados?: string | null
          vantagens_membro?: Json
          vantagens_venue?: Json
        }
        Relationships: []
      }
      mais_vanta_config_evento: {
        Row: {
          ativo: boolean
          created_at: string
          creator_sublevel_minimo: string | null
          deleted_at: string | null
          desconto_percentual: number | null
          evento_id: string
          formato_entrada: string
          id: string
          lista_id: string | null
          lote_id: string | null
          obrigacoes: Json
          tier_minimo: string
          tipo: string
          vagas_limite: number | null
          vagas_resgatadas: number | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          creator_sublevel_minimo?: string | null
          deleted_at?: string | null
          desconto_percentual?: number | null
          evento_id: string
          formato_entrada?: string
          id?: string
          lista_id?: string | null
          lote_id?: string | null
          obrigacoes?: Json
          tier_minimo: string
          tipo: string
          vagas_limite?: number | null
          vagas_resgatadas?: number | null
        }
        Update: {
          ativo?: boolean
          created_at?: string
          creator_sublevel_minimo?: string | null
          deleted_at?: string | null
          desconto_percentual?: number | null
          evento_id?: string
          formato_entrada?: string
          id?: string
          lista_id?: string | null
          lote_id?: string | null
          obrigacoes?: Json
          tier_minimo?: string
          tipo?: string
          vagas_limite?: number | null
          vagas_resgatadas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mais_vanta_lotes_evento_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mais_vanta_lotes_evento_lista_id_fkey"
            columns: ["lista_id"]
            isOneToOne: false
            referencedRelation: "listas_evento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mais_vanta_lotes_evento_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes"
            referencedColumns: ["id"]
          },
        ]
      }
      membros_clube: {
        Row: {
          alcance: string | null
          aprovado_em: string
          aprovado_por: string
          ativo: boolean
          banido_em: string | null
          banido_permanente: boolean | null
          bloqueio_ate: string | null
          bloqueio_nivel: number | null
          castigo_ate: string | null
          castigo_motivo: string | null
          categoria: string | null
          cidade_base: string | null
          cidade_principal: string | null
          cidades_ativas: string[] | null
          comunidade_origem: string | null
          convidado_por: string | null
          convites_disponiveis: number | null
          convites_usados: number | null
          creator_sublevel: string | null
          expulsoes_total: number
          genero: string | null
          id: string
          instagram_handle: string | null
          instagram_seguidores: number | null
          instagram_verificado: boolean | null
          instagram_verificado_em: string | null
          interesses: string[] | null
          meta_user_id: string | null
          nota_engajamento: number | null
          nota_interna: string | null
          status: string
          tags: string[] | null
          tier: string
          user_id: string
        }
        Insert: {
          alcance?: string | null
          aprovado_em?: string
          aprovado_por: string
          ativo?: boolean
          banido_em?: string | null
          banido_permanente?: boolean | null
          bloqueio_ate?: string | null
          bloqueio_nivel?: number | null
          castigo_ate?: string | null
          castigo_motivo?: string | null
          categoria?: string | null
          cidade_base?: string | null
          cidade_principal?: string | null
          cidades_ativas?: string[] | null
          comunidade_origem?: string | null
          convidado_por?: string | null
          convites_disponiveis?: number | null
          convites_usados?: number | null
          creator_sublevel?: string | null
          expulsoes_total?: number
          genero?: string | null
          id?: string
          instagram_handle?: string | null
          instagram_seguidores?: number | null
          instagram_verificado?: boolean | null
          instagram_verificado_em?: string | null
          interesses?: string[] | null
          meta_user_id?: string | null
          nota_engajamento?: number | null
          nota_interna?: string | null
          status?: string
          tags?: string[] | null
          tier: string
          user_id: string
        }
        Update: {
          alcance?: string | null
          aprovado_em?: string
          aprovado_por?: string
          ativo?: boolean
          banido_em?: string | null
          banido_permanente?: boolean | null
          bloqueio_ate?: string | null
          bloqueio_nivel?: number | null
          castigo_ate?: string | null
          castigo_motivo?: string | null
          categoria?: string | null
          cidade_base?: string | null
          cidade_principal?: string | null
          cidades_ativas?: string[] | null
          comunidade_origem?: string | null
          convidado_por?: string | null
          convites_disponiveis?: number | null
          convites_usados?: number | null
          creator_sublevel?: string | null
          expulsoes_total?: number
          genero?: string | null
          id?: string
          instagram_handle?: string | null
          instagram_seguidores?: number | null
          instagram_verificado?: boolean | null
          instagram_verificado_em?: string | null
          interesses?: string[] | null
          meta_user_id?: string | null
          nota_engajamento?: number | null
          nota_interna?: string | null
          status?: string
          tags?: string[] | null
          tier?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "membros_clube_comunidade_origem_fkey"
            columns: ["comunidade_origem"]
            isOneToOne: false
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membros_clube_comunidade_origem_fkey"
            columns: ["comunidade_origem"]
            isOneToOne: false
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membros_clube_comunidade_origem_fkey"
            columns: ["comunidade_origem"]
            isOneToOne: false
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membros_clube_comunidade_origem_fkey"
            columns: ["comunidade_origem"]
            isOneToOne: false
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "membros_clube_comunidade_origem_fkey"
            columns: ["comunidade_origem"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
        ]
      }
      mesas: {
        Row: {
          capacidade: number
          created_at: string
          deleted_at: string | null
          evento_id: string
          id: string
          label: string
          reservado_por: string | null
          status: string
          valor: number
          x: number
          y: number
        }
        Insert: {
          capacidade?: number
          created_at?: string
          deleted_at?: string | null
          evento_id: string
          id?: string
          label?: string
          reservado_por?: string | null
          status?: string
          valor?: number
          x?: number
          y?: number
        }
        Update: {
          capacidade?: number
          created_at?: string
          deleted_at?: string | null
          evento_id?: string
          id?: string
          label?: string
          reservado_por?: string | null
          status?: string
          valor?: number
          x?: number
          y?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          is_read: boolean
          reactions: Json
          read_at: string | null
          recipient_id: string
          sender_id: string
          text: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_read?: boolean
          reactions?: Json
          read_at?: string | null
          recipient_id: string
          sender_id: string
          text: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_read?: boolean
          reactions?: Json
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          text?: string
        }
        Relationships: []
      }
      mv_convites_especiais: {
        Row: {
          beneficio_id: string | null
          criado_em: string
          deleted_at: string | null
          enviado_por: string
          evento_id: string
          id: string
          mensagem: string | null
          status: string
          user_id: string
        }
        Insert: {
          beneficio_id?: string | null
          criado_em?: string
          deleted_at?: string | null
          enviado_por: string
          evento_id: string
          id?: string
          mensagem?: string | null
          status?: string
          user_id: string
        }
        Update: {
          beneficio_id?: string | null
          criado_em?: string
          deleted_at?: string | null
          enviado_por?: string
          evento_id?: string
          id?: string
          mensagem?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mv_convites_especiais_beneficio_id_fkey"
            columns: ["beneficio_id"]
            isOneToOne: false
            referencedRelation: "mais_vanta_config_evento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mv_convites_especiais_beneficio_id_fkey"
            columns: ["beneficio_id"]
            isOneToOne: false
            referencedRelation: "mv_alcance_evento"
            referencedColumns: ["config_id"]
          },
          {
            foreignKeyName: "mv_convites_especiais_beneficio_id_fkey"
            columns: ["beneficio_id"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["config_id"]
          },
          {
            foreignKeyName: "mv_convites_especiais_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mv_convites_especiais_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mv_convites_especiais_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mv_solicitacoes_notificacao: {
        Row: {
          criado_em: string
          deleted_at: string | null
          evento_id: string
          id: string
          membros_notificados: number | null
          mensagem: string
          produtor_id: string
          resolvido_em: string | null
          resolvido_por: string | null
          status: string
        }
        Insert: {
          criado_em?: string
          deleted_at?: string | null
          evento_id: string
          id?: string
          membros_notificados?: number | null
          mensagem?: string
          produtor_id: string
          resolvido_em?: string | null
          resolvido_por?: string | null
          status?: string
        }
        Update: {
          criado_em?: string
          deleted_at?: string | null
          evento_id?: string
          id?: string
          membros_notificados?: number | null
          mensagem?: string
          produtor_id?: string
          resolvido_em?: string | null
          resolvido_por?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "mv_solicitacoes_notificacao_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mv_solicitacoes_notificacao_produtor_id_fkey"
            columns: ["produtor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mv_solicitacoes_notificacao_resolvido_por_fkey"
            columns: ["resolvido_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      niveis_prestigio: {
        Row: {
          cor: string
          created_at: string
          icone: string | null
          id: string
          nome: string
        }
        Insert: {
          cor?: string
          created_at?: string
          icone?: string | null
          id?: string
          nome: string
        }
        Update: {
          cor?: string
          created_at?: string
          icone?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      notif_dispatch_log: {
        Row: {
          canal: string
          contexto_key: string
          dispatched_at: string
          id: string
          user_id: string
        }
        Insert: {
          canal: string
          contexto_key: string
          dispatched_at?: string
          id?: string
          user_id: string
        }
        Update: {
          canal?: string
          contexto_key?: string
          dispatched_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      notificacoes_posevento: {
        Row: {
          canal: string
          corpo_mensagem: string | null
          deleted_at: string | null
          enviada_em: string
          evento_id: string
          id: string
          lida_em: string | null
          link_contexto: string | null
          membro_id: string
          status: string
          tipo: string
        }
        Insert: {
          canal?: string
          corpo_mensagem?: string | null
          deleted_at?: string | null
          enviada_em?: string
          evento_id: string
          id?: string
          lida_em?: string | null
          link_contexto?: string | null
          membro_id: string
          status?: string
          tipo: string
        }
        Update: {
          canal?: string
          corpo_mensagem?: string | null
          deleted_at?: string | null
          enviada_em?: string
          evento_id?: string
          id?: string
          lida_em?: string | null
          link_contexto?: string | null
          membro_id?: string
          status?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_posevento_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacoes_posevento_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          lida: boolean | null
          link: string | null
          mensagem: string
          push_data: Json | null
          send_email: boolean
          send_push: boolean
          tipo: string | null
          titulo: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          lida?: boolean | null
          link?: string | null
          mensagem: string
          push_data?: Json | null
          send_email?: boolean
          send_push?: boolean
          tipo?: string | null
          titulo: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          lida?: boolean | null
          link?: string | null
          mensagem?: string
          push_data?: Json | null
          send_email?: boolean
          send_push?: boolean
          tipo?: string | null
          titulo?: string
          user_id?: string | null
        }
        Relationships: []
      }
      pagamentos_promoter: {
        Row: {
          cota_id: string | null
          criado_em: string
          data: string
          evento_id: string | null
          id: string
          observacao: string | null
          promoter_id: string
          registrado_por: string
          valor: number
        }
        Insert: {
          cota_id?: string | null
          criado_em?: string
          data?: string
          evento_id?: string | null
          id?: string
          observacao?: string | null
          promoter_id: string
          registrado_por: string
          valor: number
        }
        Update: {
          cota_id?: string | null
          criado_em?: string
          data?: string
          evento_id?: string | null
          id?: string
          observacao?: string | null
          promoter_id?: string
          registrado_por?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_promoter_cota_id_fkey"
            columns: ["cota_id"]
            isOneToOne: false
            referencedRelation: "cotas_promoter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_promoter_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
        ]
      }
      parceiros_mais_vanta: {
        Row: {
          ativo: boolean
          cidade_id: string
          contato_email: string | null
          contato_nome: string | null
          contato_telefone: string | null
          coords: Json | null
          criado_em: string
          criado_por: string
          descricao: string | null
          endereco: string | null
          foto_url: string | null
          id: string
          instagram_handle: string | null
          nome: string
          plano: string
          plano_fim: string | null
          plano_inicio: string | null
          resgates_mes_limite: number
          resgates_mes_usados: number
          tipo: string
          trial_ativo: boolean
          user_id: string | null
        }
        Insert: {
          ativo?: boolean
          cidade_id: string
          contato_email?: string | null
          contato_nome?: string | null
          contato_telefone?: string | null
          coords?: Json | null
          criado_em?: string
          criado_por: string
          descricao?: string | null
          endereco?: string | null
          foto_url?: string | null
          id?: string
          instagram_handle?: string | null
          nome: string
          plano?: string
          plano_fim?: string | null
          plano_inicio?: string | null
          resgates_mes_limite?: number
          resgates_mes_usados?: number
          tipo: string
          trial_ativo?: boolean
          user_id?: string | null
        }
        Update: {
          ativo?: boolean
          cidade_id?: string
          contato_email?: string | null
          contato_nome?: string | null
          contato_telefone?: string | null
          coords?: Json | null
          criado_em?: string
          criado_por?: string
          descricao?: string | null
          endereco?: string | null
          foto_url?: string | null
          id?: string
          instagram_handle?: string | null
          nome?: string
          plano?: string
          plano_fim?: string | null
          plano_inicio?: string | null
          resgates_mes_limite?: number
          resgates_mes_usados?: number
          tipo?: string
          trial_ativo?: boolean
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parceiros_mais_vanta_cidade_id_fkey"
            columns: ["cidade_id"]
            isOneToOne: false
            referencedRelation: "cidades_mais_vanta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parceiros_mais_vanta_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parceiros_solicitacoes: {
        Row: {
          cidade: string
          cnpj: string | null
          created_at: string
          email: string
          id: string
          nome_casa: string
          responsavel: string
          status: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          cidade: string
          cnpj?: string | null
          created_at?: string
          email: string
          id?: string
          nome_casa: string
          responsavel: string
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          cidade?: string
          cnpj?: string | null
          created_at?: string
          email?: string
          id?: string
          nome_casa?: string
          responsavel?: string
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      passport_aprovacoes: {
        Row: {
          cidade: string | null
          comunidade_id: string | null
          id: string
          resolvido_em: string | null
          resolvido_por: string | null
          solicitado_em: string
          status: string
          user_id: string
        }
        Insert: {
          cidade?: string | null
          comunidade_id?: string | null
          id?: string
          resolvido_em?: string | null
          resolvido_por?: string | null
          solicitado_em?: string
          status?: string
          user_id: string
        }
        Update: {
          cidade?: string | null
          comunidade_id?: string | null
          id?: string
          resolvido_em?: string | null
          resolvido_por?: string | null
          solicitado_em?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "passport_aprovacoes_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passport_aprovacoes_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passport_aprovacoes_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passport_aprovacoes_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "passport_aprovacoes_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
        ]
      }
      pedidos_checkout: {
        Row: {
          created_at: string | null
          dados_compra: Json
          evento_id: string
          id: string
          lote_id: string
          paid_at: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          user_id: string
          valor_total_centavos: number
        }
        Insert: {
          created_at?: string | null
          dados_compra: Json
          evento_id: string
          id?: string
          lote_id: string
          paid_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          user_id: string
          valor_total_centavos: number
        }
        Update: {
          created_at?: string | null
          dados_compra?: Json
          evento_id?: string
          id?: string
          lote_id?: string
          paid_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          user_id?: string
          valor_total_centavos?: number
        }
        Relationships: []
      }
      pendencias: {
        Row: {
          agente_responsavel: string | null
          created_at: string | null
          data_origem: string | null
          deleted_at: string | null
          dependencias: string[] | null
          descricao: string | null
          grupo: string | null
          id: string
          numero: string
          prioridade: string
          resolved_at: string | null
          resolved_commit: string | null
          resolved_session: string | null
          sessao_origem: string | null
          setor: string | null
          status: string
          tags: string[] | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          agente_responsavel?: string | null
          created_at?: string | null
          data_origem?: string | null
          deleted_at?: string | null
          dependencias?: string[] | null
          descricao?: string | null
          grupo?: string | null
          id?: string
          numero: string
          prioridade?: string
          resolved_at?: string | null
          resolved_commit?: string | null
          resolved_session?: string | null
          sessao_origem?: string | null
          setor?: string | null
          status?: string
          tags?: string[] | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          agente_responsavel?: string | null
          created_at?: string | null
          data_origem?: string | null
          deleted_at?: string | null
          dependencias?: string[] | null
          descricao?: string | null
          grupo?: string | null
          id?: string
          numero?: string
          prioridade?: string
          resolved_at?: string | null
          resolved_commit?: string | null
          resolved_session?: string | null
          sessao_origem?: string | null
          setor?: string | null
          status?: string
          tags?: string[] | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      planos_mais_vanta: {
        Row: {
          acompanhante: boolean
          ativo: boolean
          atualizado_em: string | null
          criado_em: string | null
          descricao: string | null
          destaque: boolean
          dias_castigo: number
          id: string
          limite_eventos_mv: number
          limite_membros: number
          limite_vagas_evento: number
          nome: string
          ordem: number
          prazo_post_horas: number
          preco_avulso: number
          preco_mensal: number
          stripe_price_id: string | null
          tier_minimo: string
          tiers_acessiveis: string[]
        }
        Insert: {
          acompanhante?: boolean
          ativo?: boolean
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string | null
          destaque?: boolean
          dias_castigo?: number
          id?: string
          limite_eventos_mv?: number
          limite_membros?: number
          limite_vagas_evento?: number
          nome: string
          ordem?: number
          prazo_post_horas?: number
          preco_avulso?: number
          preco_mensal?: number
          stripe_price_id?: string | null
          tier_minimo?: string
          tiers_acessiveis?: string[]
        }
        Update: {
          acompanhante?: boolean
          ativo?: boolean
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string | null
          destaque?: boolean
          dias_castigo?: number
          id?: string
          limite_eventos_mv?: number
          limite_membros?: number
          limite_vagas_evento?: number
          nome?: string
          ordem?: number
          prazo_post_horas?: number
          preco_avulso?: number
          preco_mensal?: number
          stripe_price_id?: string | null
          tier_minimo?: string
          tiers_acessiveis?: string[]
        }
        Relationships: []
      }
      platform_config: {
        Row: {
          descricao: string | null
          key: string
          label: string | null
          tipo: string | null
          updated_at: string | null
          updated_by: string | null
          value: string
        }
        Insert: {
          descricao?: string | null
          key: string
          label?: string | null
          tipo?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value: string
        }
        Update: {
          descricao?: string | null
          key?: string
          label?: string | null
          tipo?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_config_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pmf_responses: {
        Row: {
          created_at: string | null
          id: string
          response: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          response: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          response?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pmf_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          album_urls: string[]
          avatar_url: string | null
          biografia: string
          cidade: string | null
          cpf: string
          created_at: string | null
          data_nascimento: string | null
          deleted_at: string | null
          email: string | null
          estado: string | null
          excluido: boolean | null
          excluido_em: string | null
          genero: string | null
          id: string
          instagram: string | null
          instagram_followers: number | null
          interesses: string[]
          last_seen: string | null
          mood_emoji: string | null
          mood_expires_at: string | null
          mood_text: string | null
          nome: string | null
          pix_chave: string | null
          pix_tipo: string | null
          preferencias: Json | null
          privacidade: Json
          role: string | null
          suspended: boolean | null
          telefone_ddd: string
          telefone_numero: string
          tos_accepted_at: string | null
          tos_ip: string | null
          tos_version: string | null
          updated_at: string | null
          username: string | null
          wallet_pin_hash: string | null
        }
        Insert: {
          album_urls?: string[]
          avatar_url?: string | null
          biografia?: string
          cidade?: string | null
          cpf: string
          created_at?: string | null
          data_nascimento?: string | null
          deleted_at?: string | null
          email?: string | null
          estado?: string | null
          excluido?: boolean | null
          excluido_em?: string | null
          genero?: string | null
          id: string
          instagram?: string | null
          instagram_followers?: number | null
          interesses?: string[]
          last_seen?: string | null
          mood_emoji?: string | null
          mood_expires_at?: string | null
          mood_text?: string | null
          nome?: string | null
          pix_chave?: string | null
          pix_tipo?: string | null
          preferencias?: Json | null
          privacidade?: Json
          role?: string | null
          suspended?: boolean | null
          telefone_ddd?: string
          telefone_numero?: string
          tos_accepted_at?: string | null
          tos_ip?: string | null
          tos_version?: string | null
          updated_at?: string | null
          username?: string | null
          wallet_pin_hash?: string | null
        }
        Update: {
          album_urls?: string[]
          avatar_url?: string | null
          biografia?: string
          cidade?: string | null
          cpf?: string
          created_at?: string | null
          data_nascimento?: string | null
          deleted_at?: string | null
          email?: string | null
          estado?: string | null
          excluido?: boolean | null
          excluido_em?: string | null
          genero?: string | null
          id?: string
          instagram?: string | null
          instagram_followers?: number | null
          interesses?: string[]
          last_seen?: string | null
          mood_emoji?: string | null
          mood_expires_at?: string | null
          mood_text?: string | null
          nome?: string | null
          pix_chave?: string | null
          pix_tipo?: string | null
          preferencias?: Json | null
          privacidade?: Json
          role?: string | null
          suspended?: boolean | null
          telefone_ddd?: string
          telefone_numero?: string
          tos_accepted_at?: string | null
          tos_ip?: string | null
          tos_version?: string | null
          updated_at?: string | null
          username?: string | null
          wallet_pin_hash?: string | null
        }
        Relationships: []
      }
      push_agendados: {
        Row: {
          acao_valor: string | null
          agendar_para: string
          canais: string[]
          criado_em: string
          criado_por: string
          enviado_em: string | null
          id: string
          link_notif: string | null
          mensagem: string
          resultado: Json | null
          segmento_tipo: string
          segmento_valor: string | null
          status: string
          tipo_acao: string | null
          titulo: string
        }
        Insert: {
          acao_valor?: string | null
          agendar_para: string
          canais?: string[]
          criado_em?: string
          criado_por: string
          enviado_em?: string | null
          id?: string
          link_notif?: string | null
          mensagem: string
          resultado?: Json | null
          segmento_tipo?: string
          segmento_valor?: string | null
          status?: string
          tipo_acao?: string | null
          titulo: string
        }
        Update: {
          acao_valor?: string | null
          agendar_para?: string
          canais?: string[]
          criado_em?: string
          criado_por?: string
          enviado_em?: string | null
          id?: string
          link_notif?: string | null
          mensagem?: string
          resultado?: Json | null
          segmento_tipo?: string
          segmento_valor?: string | null
          status?: string
          tipo_acao?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_agendados_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth_key: string | null
          created_at: string
          deleted_at: string | null
          device_info: string | null
          endpoint: string | null
          fcm_token: string | null
          id: string
          last_used_at: string | null
          p256dh: string | null
          user_id: string
        }
        Insert: {
          auth_key?: string | null
          created_at?: string
          deleted_at?: string | null
          device_info?: string | null
          endpoint?: string | null
          fcm_token?: string | null
          id?: string
          last_used_at?: string | null
          p256dh?: string | null
          user_id: string
        }
        Update: {
          auth_key?: string | null
          created_at?: string
          deleted_at?: string | null
          device_info?: string | null
          endpoint?: string | null
          fcm_token?: string | null
          id?: string
          last_used_at?: string | null
          p256dh?: string | null
          user_id?: string
        }
        Relationships: []
      }
      push_templates: {
        Row: {
          acao_valor: string | null
          atualizado_em: string
          canais: string[]
          criado_em: string
          criado_por: string
          deleted_at: string | null
          id: string
          mensagem: string
          nome: string
          tipo_acao: string | null
          titulo: string
        }
        Insert: {
          acao_valor?: string | null
          atualizado_em?: string
          canais?: string[]
          criado_em?: string
          criado_por: string
          deleted_at?: string | null
          id?: string
          mensagem: string
          nome: string
          tipo_acao?: string | null
          titulo: string
        }
        Update: {
          acao_valor?: string | null
          atualizado_em?: string
          canais?: string[]
          criado_em?: string
          criado_por?: string
          deleted_at?: string | null
          id?: string
          mensagem?: string
          nome?: string
          tipo_acao?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_templates_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          id: number
          key: string
          ts: string
        }
        Insert: {
          id?: number
          key: string
          ts?: string
        }
        Update: {
          id?: number
          key?: string
          ts?: string
        }
        Relationships: []
      }
      reembolsos: {
        Row: {
          aprovado_por: string | null
          comprador_nome: string | null
          created_at: string
          etapa: string | null
          evento_id: string
          gerente_decisao: string | null
          gerente_decisao_em: string | null
          gerente_id: string | null
          id: string
          motivo: string
          notificado_em: string | null
          processado_em: string | null
          refund_automatico: boolean | null
          rejeitado_em: string | null
          rejeitado_motivo: string | null
          rejeitado_por: string | null
          socio_decisao: string | null
          socio_decisao_em: string | null
          socio_id: string | null
          solicitado_em: string
          solicitado_por: string | null
          status: string
          stripe_refund_id: string | null
          ticket_id: string
          tipo: string
          updated_at: string
          valor: number
        }
        Insert: {
          aprovado_por?: string | null
          comprador_nome?: string | null
          created_at?: string
          etapa?: string | null
          evento_id: string
          gerente_decisao?: string | null
          gerente_decisao_em?: string | null
          gerente_id?: string | null
          id?: string
          motivo: string
          notificado_em?: string | null
          processado_em?: string | null
          refund_automatico?: boolean | null
          rejeitado_em?: string | null
          rejeitado_motivo?: string | null
          rejeitado_por?: string | null
          socio_decisao?: string | null
          socio_decisao_em?: string | null
          socio_id?: string | null
          solicitado_em?: string
          solicitado_por?: string | null
          status?: string
          stripe_refund_id?: string | null
          ticket_id: string
          tipo: string
          updated_at?: string
          valor: number
        }
        Update: {
          aprovado_por?: string | null
          comprador_nome?: string | null
          created_at?: string
          etapa?: string | null
          evento_id?: string
          gerente_decisao?: string | null
          gerente_decisao_em?: string | null
          gerente_id?: string | null
          id?: string
          motivo?: string
          notificado_em?: string | null
          processado_em?: string | null
          refund_automatico?: boolean | null
          rejeitado_em?: string | null
          rejeitado_motivo?: string | null
          rejeitado_por?: string | null
          socio_decisao?: string | null
          socio_decisao_em?: string | null
          socio_id?: string | null
          solicitado_em?: string
          solicitado_por?: string | null
          status?: string
          stripe_refund_id?: string | null
          ticket_id?: string
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_aprovado_por"
            columns: ["aprovado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_evento_id"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_rejeitado_por"
            columns: ["rejeitado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_solicitado_por"
            columns: ["solicitado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_ticket_id"
            columns: ["ticket_id"]
            isOneToOne: true
            referencedRelation: "tickets_caixa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reembolsos_gerente_id_fkey"
            columns: ["gerente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reembolsos_socio_id_fkey"
            columns: ["socio_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reentradas_mais_vanta: {
        Row: {
          criado_em: string
          decidido_em: string | null
          decidido_por: string | null
          expulsao_anterior_em: string | null
          expulsao_anterior_numero: number | null
          id: string
          motivo: string | null
          motivo_decisao: string | null
          status: string
          user_id: string
        }
        Insert: {
          criado_em?: string
          decidido_em?: string | null
          decidido_por?: string | null
          expulsao_anterior_em?: string | null
          expulsao_anterior_numero?: number | null
          id?: string
          motivo?: string | null
          motivo_decisao?: string | null
          status?: string
          user_id: string
        }
        Update: {
          criado_em?: string
          decidido_em?: string | null
          decidido_por?: string | null
          expulsao_anterior_em?: string | null
          expulsao_anterior_numero?: number | null
          id?: string
          motivo?: string | null
          motivo_decisao?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      regras_lista: {
        Row: {
          abobora_regra_id: string | null
          area: string | null
          cor: string | null
          created_at: string
          deleted_at: string | null
          genero: string
          hora_corte: string | null
          id: string
          label: string
          lista_id: string
          saldo_banco: number | null
          teto_global: number | null
          tipo: string | null
          valor: number | null
        }
        Insert: {
          abobora_regra_id?: string | null
          area?: string | null
          cor?: string | null
          created_at?: string
          deleted_at?: string | null
          genero?: string
          hora_corte?: string | null
          id?: string
          label: string
          lista_id: string
          saldo_banco?: number | null
          teto_global?: number | null
          tipo?: string | null
          valor?: number | null
        }
        Update: {
          abobora_regra_id?: string | null
          area?: string | null
          cor?: string | null
          created_at?: string
          deleted_at?: string | null
          genero?: string
          hora_corte?: string | null
          id?: string
          label?: string
          lista_id?: string
          saldo_banco?: number | null
          teto_global?: number | null
          tipo?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "regras_lista_abobora_regra_id_fkey"
            columns: ["abobora_regra_id"]
            isOneToOne: false
            referencedRelation: "regras_lista"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regras_lista_lista_id_fkey"
            columns: ["lista_id"]
            isOneToOne: false
            referencedRelation: "listas_evento"
            referencedColumns: ["id"]
          },
        ]
      }
      relatorios_semanais: {
        Row: {
          comunidade_id: string | null
          criado_em: string | null
          dados: Json
          enviado_em: string | null
          id: string
          semana_fim: string
          semana_inicio: string
        }
        Insert: {
          comunidade_id?: string | null
          criado_em?: string | null
          dados: Json
          enviado_em?: string | null
          id?: string
          semana_fim: string
          semana_inicio: string
        }
        Update: {
          comunidade_id?: string | null
          criado_em?: string | null
          dados?: Json
          enviado_em?: string | null
          id?: string
          semana_fim?: string
          semana_inicio?: string
        }
        Relationships: [
          {
            foreignKeyName: "relatorios_semanais_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_semanais_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_semanais_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_semanais_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "relatorios_semanais_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
        ]
      }
      resgates_mais_vanta: {
        Row: {
          aplicado_em: string
          checkin_em: string | null
          concluido_em: string | null
          deal_id: string | null
          id: string
          parceiro_id: string
          post_url: string | null
          post_verificado: boolean
          post_verificado_em: string | null
          qr_token: string | null
          selecionado_em: string | null
          selecionado_por: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          aplicado_em?: string
          checkin_em?: string | null
          concluido_em?: string | null
          deal_id?: string | null
          id?: string
          parceiro_id: string
          post_url?: string | null
          post_verificado?: boolean
          post_verificado_em?: string | null
          qr_token?: string | null
          selecionado_em?: string | null
          selecionado_por?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          aplicado_em?: string
          checkin_em?: string | null
          concluido_em?: string | null
          deal_id?: string | null
          id?: string
          parceiro_id?: string
          post_url?: string | null
          post_verificado?: boolean
          post_verificado_em?: string | null
          qr_token?: string | null
          selecionado_em?: string | null
          selecionado_por?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resgates_mais_vanta_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals_mais_vanta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resgates_mais_vanta_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros_mais_vanta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resgates_mais_vanta_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resgates_mv_evento: {
        Row: {
          beneficio_id: string | null
          cancelado_em: string | null
          evento_id: string | null
          id: string
          infraction_registered_em: string | null
          post_deadline_em: string | null
          post_url: string | null
          post_verificado: boolean
          rating_produtor: number | null
          resgatado_em: string
          status: string
          tier_snapshot: string | null
          user_id: string | null
        }
        Insert: {
          beneficio_id?: string | null
          cancelado_em?: string | null
          evento_id?: string | null
          id?: string
          infraction_registered_em?: string | null
          post_deadline_em?: string | null
          post_url?: string | null
          post_verificado?: boolean
          rating_produtor?: number | null
          resgatado_em?: string
          status?: string
          tier_snapshot?: string | null
          user_id?: string | null
        }
        Update: {
          beneficio_id?: string | null
          cancelado_em?: string | null
          evento_id?: string | null
          id?: string
          infraction_registered_em?: string | null
          post_deadline_em?: string | null
          post_url?: string | null
          post_verificado?: boolean
          rating_produtor?: number | null
          resgatado_em?: string
          status?: string
          tier_snapshot?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resgates_mv_evento_beneficio_id_fkey"
            columns: ["beneficio_id"]
            isOneToOne: false
            referencedRelation: "mais_vanta_config_evento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resgates_mv_evento_beneficio_id_fkey"
            columns: ["beneficio_id"]
            isOneToOne: false
            referencedRelation: "mv_alcance_evento"
            referencedColumns: ["config_id"]
          },
          {
            foreignKeyName: "resgates_mv_evento_beneficio_id_fkey"
            columns: ["beneficio_id"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["config_id"]
          },
          {
            foreignKeyName: "resgates_mv_evento_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resgates_mv_evento_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews_evento: {
        Row: {
          comentario: string | null
          created_at: string
          deleted_at: string | null
          evento_id: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          comentario?: string | null
          created_at?: string
          deleted_at?: string | null
          evento_id: string
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          comentario?: string | null
          created_at?: string
          deleted_at?: string | null
          evento_id?: string
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_evento_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          categoria: string | null
          deleted_at: string | null
          key: string
          label: string | null
          updated_at: string | null
          updated_by: string | null
          value: string
        }
        Insert: {
          categoria?: string | null
          deleted_at?: string | null
          key: string
          label?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: string
        }
        Update: {
          categoria?: string | null
          deleted_at?: string | null
          key?: string
          label?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_content_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      socios_evento: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          evento_id: string
          historico_propostas: Json | null
          id: string
          mensagem_negociacao: string | null
          motivo_rejeicao: string | null
          permissoes: string[] | null
          prazo_resposta: string | null
          rodada_negociacao: number | null
          socio_id: string
          split_percentual: number
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          evento_id: string
          historico_propostas?: Json | null
          id?: string
          mensagem_negociacao?: string | null
          motivo_rejeicao?: string | null
          permissoes?: string[] | null
          prazo_resposta?: string | null
          rodada_negociacao?: number | null
          socio_id: string
          split_percentual?: number
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          evento_id?: string
          historico_propostas?: Json | null
          id?: string
          mensagem_negociacao?: string | null
          motivo_rejeicao?: string | null
          permissoes?: string[] | null
          prazo_resposta?: string | null
          rodada_negociacao?: number | null
          socio_id?: string
          split_percentual?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "socios_evento_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "socios_evento_socio_id_fkey"
            columns: ["socio_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes_clube: {
        Row: {
          balde_sugerido: string | null
          cidade: string | null
          codigo_verificacao: string | null
          como_conheceu: string | null
          convidado_por: string | null
          convite_id: string | null
          criado_em: string
          frequencia: string | null
          id: string
          indicado_por: string | null
          instagram_handle: string
          instagram_seguidores: number | null
          instagram_verificado: boolean | null
          instagram_verificado_em: string | null
          profissao: string | null
          resolvido_em: string | null
          resolvido_por: string | null
          status: string
          tier_atribuido: string | null
          tier_pre_atribuido: string | null
          user_id: string
        }
        Insert: {
          balde_sugerido?: string | null
          cidade?: string | null
          codigo_verificacao?: string | null
          como_conheceu?: string | null
          convidado_por?: string | null
          convite_id?: string | null
          criado_em?: string
          frequencia?: string | null
          id?: string
          indicado_por?: string | null
          instagram_handle: string
          instagram_seguidores?: number | null
          instagram_verificado?: boolean | null
          instagram_verificado_em?: string | null
          profissao?: string | null
          resolvido_em?: string | null
          resolvido_por?: string | null
          status?: string
          tier_atribuido?: string | null
          tier_pre_atribuido?: string | null
          user_id: string
        }
        Update: {
          balde_sugerido?: string | null
          cidade?: string | null
          codigo_verificacao?: string | null
          como_conheceu?: string | null
          convidado_por?: string | null
          convite_id?: string | null
          criado_em?: string
          frequencia?: string | null
          id?: string
          indicado_por?: string | null
          instagram_handle?: string
          instagram_seguidores?: number | null
          instagram_verificado?: boolean | null
          instagram_verificado_em?: string | null
          profissao?: string | null
          resolvido_em?: string | null
          resolvido_por?: string | null
          status?: string
          tier_atribuido?: string | null
          tier_pre_atribuido?: string | null
          user_id?: string
        }
        Relationships: []
      }
      solicitacoes_parceria: {
        Row: {
          aceite_termos: boolean
          aceite_termos_em: string | null
          analisado_em: string | null
          analisado_por: string | null
          capacidade_media: string | null
          categoria: string
          cidade: string
          comunidade_criada_id: string | null
          criado_em: string
          dados_comunidade: Json | null
          deleted_at: string | null
          email_contato: string | null
          estilos: string[] | null
          fotos: string[] | null
          frequencia: string | null
          google_maps: string | null
          id: string
          instagram: string
          intencoes: string[]
          media_publico: string | null
          motivo_rejeicao: string | null
          nome: string
          objetivo: string | null
          observacoes_master: string | null
          publico_alvo: string[] | null
          site: string | null
          status: string
          taxas_aprovadas: Json | null
          telefone: string | null
          tempo_mercado: string | null
          tipo: string
          user_id: string
        }
        Insert: {
          aceite_termos?: boolean
          aceite_termos_em?: string | null
          analisado_em?: string | null
          analisado_por?: string | null
          capacidade_media?: string | null
          categoria: string
          cidade: string
          comunidade_criada_id?: string | null
          criado_em?: string
          dados_comunidade?: Json | null
          deleted_at?: string | null
          email_contato?: string | null
          estilos?: string[] | null
          fotos?: string[] | null
          frequencia?: string | null
          google_maps?: string | null
          id?: string
          instagram: string
          intencoes?: string[]
          media_publico?: string | null
          motivo_rejeicao?: string | null
          nome: string
          objetivo?: string | null
          observacoes_master?: string | null
          publico_alvo?: string[] | null
          site?: string | null
          status?: string
          taxas_aprovadas?: Json | null
          telefone?: string | null
          tempo_mercado?: string | null
          tipo: string
          user_id: string
        }
        Update: {
          aceite_termos?: boolean
          aceite_termos_em?: string | null
          analisado_em?: string | null
          analisado_por?: string | null
          capacidade_media?: string | null
          categoria?: string
          cidade?: string
          comunidade_criada_id?: string | null
          criado_em?: string
          dados_comunidade?: Json | null
          deleted_at?: string | null
          email_contato?: string | null
          estilos?: string[] | null
          fotos?: string[] | null
          frequencia?: string | null
          google_maps?: string | null
          id?: string
          instagram?: string
          intencoes?: string[]
          media_publico?: string | null
          motivo_rejeicao?: string | null
          nome?: string
          objetivo?: string | null
          observacoes_master?: string | null
          publico_alvo?: string[] | null
          site?: string | null
          status?: string
          taxas_aprovadas?: Json | null
          telefone?: string | null
          tempo_mercado?: string | null
          tipo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_parceria_analisado_por_fkey"
            columns: ["analisado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_parceria_comunidade_criada_id_fkey"
            columns: ["comunidade_criada_id"]
            isOneToOne: false
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_parceria_comunidade_criada_id_fkey"
            columns: ["comunidade_criada_id"]
            isOneToOne: false
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_parceria_comunidade_criada_id_fkey"
            columns: ["comunidade_criada_id"]
            isOneToOne: false
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_parceria_comunidade_criada_id_fkey"
            columns: ["comunidade_criada_id"]
            isOneToOne: false
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "solicitacoes_parceria_comunidade_criada_id_fkey"
            columns: ["comunidade_criada_id"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "solicitacoes_parceria_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes_saque: {
        Row: {
          comprovante_url: string | null
          criado_em: string | null
          etapa: string | null
          evento_id: string
          gerente_aprovado_em: string | null
          gerente_aprovado_por: string | null
          id: string
          motivo_recusa: string | null
          pix_chave: string
          pix_tipo: string
          processado_em: string | null
          processado_por: string | null
          produtor_id: string
          solicitado_em: string
          status: string
          valor: number
          valor_bruto: number | null
          valor_liquido: number
          valor_taxa: number
        }
        Insert: {
          comprovante_url?: string | null
          criado_em?: string | null
          etapa?: string | null
          evento_id: string
          gerente_aprovado_em?: string | null
          gerente_aprovado_por?: string | null
          id?: string
          motivo_recusa?: string | null
          pix_chave: string
          pix_tipo?: string
          processado_em?: string | null
          processado_por?: string | null
          produtor_id: string
          solicitado_em?: string
          status?: string
          valor: number
          valor_bruto?: number | null
          valor_liquido: number
          valor_taxa: number
        }
        Update: {
          comprovante_url?: string | null
          criado_em?: string | null
          etapa?: string | null
          evento_id?: string
          gerente_aprovado_em?: string | null
          gerente_aprovado_por?: string | null
          id?: string
          motivo_recusa?: string | null
          pix_chave?: string
          pix_tipo?: string
          processado_em?: string | null
          processado_por?: string | null
          produtor_id?: string
          solicitado_em?: string
          status?: string
          valor?: number
          valor_bruto?: number | null
          valor_liquido?: number
          valor_taxa?: number
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_saque_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_saque_gerente_aprovado_por_fkey"
            columns: ["gerente_aprovado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      splits_config: {
        Row: {
          beneficiario_id: string
          comunidade_id: string | null
          criado_em: string | null
          criado_por: string | null
          descricao: string | null
          evento_id: string | null
          fixo: number | null
          id: string
          percentual: number
          tipo: string
        }
        Insert: {
          beneficiario_id: string
          comunidade_id?: string | null
          criado_em?: string | null
          criado_por?: string | null
          descricao?: string | null
          evento_id?: string | null
          fixo?: number | null
          id?: string
          percentual: number
          tipo: string
        }
        Update: {
          beneficiario_id?: string
          comunidade_id?: string | null
          criado_em?: string | null
          criado_por?: string | null
          descricao?: string | null
          evento_id?: string | null
          fixo?: number | null
          id?: string
          percentual?: number
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "splits_config_beneficiario_id_fkey"
            columns: ["beneficiario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "splits_config_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "splits_config_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "splits_config_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "splits_config_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "splits_config_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "splits_config_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "splits_config_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_webhook_events: {
        Row: {
          event_id: string
          event_type: string
          received_at: string
        }
        Insert: {
          event_id: string
          event_type: string
          received_at?: string
        }
        Update: {
          event_id?: string
          event_type?: string
          received_at?: string
        }
        Relationships: []
      }
      tickets_caixa: {
        Row: {
          codigo_qr: string | null
          comprovante_id: string | null
          cpf: string
          criado_em: string
          criado_por: string | null
          email: string
          emitido_em: string | null
          evento_id: string
          id: string
          lote_id: string | null
          metodo_pagamento: string
          nome_titular: string
          observacao_validacao: string | null
          origem: string
          owner_id: string | null
          selfie_url: string | null
          status: string
          transfer_policy: string
          usado_em: string | null
          usado_por: string | null
          utm_source: string | null
          validacao_forcada: boolean | null
          validado_por: string | null
          validado_por_nome: string | null
          valor: number
          variacao_id: string | null
          variacao_label: string | null
        }
        Insert: {
          codigo_qr?: string | null
          comprovante_id?: string | null
          cpf?: string
          criado_em?: string
          criado_por?: string | null
          email: string
          emitido_em?: string | null
          evento_id: string
          id?: string
          lote_id?: string | null
          metodo_pagamento?: string
          nome_titular?: string
          observacao_validacao?: string | null
          origem?: string
          owner_id?: string | null
          selfie_url?: string | null
          status?: string
          transfer_policy?: string
          usado_em?: string | null
          usado_por?: string | null
          utm_source?: string | null
          validacao_forcada?: boolean | null
          validado_por?: string | null
          validado_por_nome?: string | null
          valor?: number
          variacao_id?: string | null
          variacao_label?: string | null
        }
        Update: {
          codigo_qr?: string | null
          comprovante_id?: string | null
          cpf?: string
          criado_em?: string
          criado_por?: string | null
          email?: string
          emitido_em?: string | null
          evento_id?: string
          id?: string
          lote_id?: string | null
          metodo_pagamento?: string
          nome_titular?: string
          observacao_validacao?: string | null
          origem?: string
          owner_id?: string | null
          selfie_url?: string | null
          status?: string
          transfer_policy?: string
          usado_em?: string | null
          usado_por?: string | null
          utm_source?: string | null
          validacao_forcada?: boolean | null
          validado_por?: string | null
          validado_por_nome?: string | null
          valor?: number
          variacao_id?: string | null
          variacao_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_caixa_comprovante_id_fkey"
            columns: ["comprovante_id"]
            isOneToOne: false
            referencedRelation: "comprovantes_meia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_caixa_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_caixa_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_caixa_validado_por_fkey"
            columns: ["validado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_caixa_variacao_id_fkey"
            columns: ["variacao_id"]
            isOneToOne: false
            referencedRelation: "variacoes_ingresso"
            referencedColumns: ["id"]
          },
        ]
      }
      tiers_mais_vanta: {
        Row: {
          ativo: boolean
          beneficios: string[]
          cor: string
          criado_em: string | null
          id: string
          limite_mensal: number
          nome: string
          ordem: number
        }
        Insert: {
          ativo?: boolean
          beneficios?: string[]
          cor?: string
          criado_em?: string | null
          id: string
          limite_mensal?: number
          nome: string
          ordem?: number
        }
        Update: {
          ativo?: boolean
          beneficios?: string[]
          cor?: string
          criado_em?: string | null
          id?: string
          limite_mensal?: number
          nome?: string
          ordem?: number
        }
        Relationships: []
      }
      transactions: {
        Row: {
          comprador_id: string | null
          created_at: string
          cupom_codigo: string | null
          desconto_cupom_valor: number | null
          email: string
          evento_id: string
          id: string
          status: string
          taxa_aplicada: number
          ticket_id: string | null
          tipo: string
          valor_bruto: number
          valor_liquido: number
        }
        Insert: {
          comprador_id?: string | null
          created_at?: string
          cupom_codigo?: string | null
          desconto_cupom_valor?: number | null
          email: string
          evento_id: string
          id?: string
          status?: string
          taxa_aplicada?: number
          ticket_id?: string | null
          tipo?: string
          valor_bruto: number
          valor_liquido: number
        }
        Update: {
          comprador_id?: string | null
          created_at?: string
          cupom_codigo?: string | null
          desconto_cupom_valor?: number | null
          email?: string
          evento_id?: string
          id?: string
          status?: string
          taxa_aplicada?: number
          ticket_id?: string | null
          tipo?: string
          valor_bruto?: number
          valor_liquido?: number
        }
        Relationships: [
          {
            foreignKeyName: "transactions_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets_caixa"
            referencedColumns: ["id"]
          },
        ]
      }
      transferencias_ingresso: {
        Row: {
          criado_em: string
          data_evento: string | null
          destinatario_id: string
          destinatario_nome: string
          evento_id: string
          evento_imagem: string | null
          evento_local: string | null
          id: string
          remetente_id: string
          remetente_nome: string
          requer_comprovante: boolean
          status: string
          ticket_id: string
          titulo_evento: string | null
          variacao_label: string | null
        }
        Insert: {
          criado_em?: string
          data_evento?: string | null
          destinatario_id: string
          destinatario_nome: string
          evento_id: string
          evento_imagem?: string | null
          evento_local?: string | null
          id?: string
          remetente_id: string
          remetente_nome: string
          requer_comprovante?: boolean
          status?: string
          ticket_id: string
          titulo_evento?: string | null
          variacao_label?: string | null
        }
        Update: {
          criado_em?: string
          data_evento?: string | null
          destinatario_id?: string
          destinatario_nome?: string
          evento_id?: string
          evento_imagem?: string | null
          evento_local?: string | null
          id?: string
          remetente_id?: string
          remetente_nome?: string
          requer_comprovante?: boolean
          status?: string
          ticket_id?: string
          titulo_evento?: string | null
          variacao_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_transf_evento"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_transf_ticket"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets_caixa"
            referencedColumns: ["id"]
          },
        ]
      }
      user_behavior: {
        Row: {
          action_type: string
          created_at: string
          event_id: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          event_id?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          event_id?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_behavior_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
        ]
      }
      user_consents: {
        Row: {
          aceito_em: string
          deleted_at: string | null
          document_checksum: string | null
          documento_tipo: string
          documento_versao: number
          fonte: string | null
          id: string
          ip_address: string | null
          metadata: Json
          user_agent: string | null
          user_id: string
        }
        Insert: {
          aceito_em?: string
          deleted_at?: string | null
          document_checksum?: string | null
          documento_tipo: string
          documento_versao: number
          fonte?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json
          user_agent?: string | null
          user_id: string
        }
        Update: {
          aceito_em?: string
          deleted_at?: string | null
          document_checksum?: string | null
          documento_tipo?: string
          documento_versao?: number
          fonte?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_consents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vanta_indica: {
        Row: {
          acao: Json | null
          acao_link: string
          alvo_localidades: string[]
          ativo: boolean
          badge: string
          criado_em: string
          criado_por: string | null
          deleted_at: string | null
          id: string
          imagem: string | null
          img_position: string | null
          layout_config: Json | null
          subtitulo: string
          text_align: string | null
          tipo: string
          titulo: string
        }
        Insert: {
          acao?: Json | null
          acao_link?: string
          alvo_localidades?: string[]
          ativo?: boolean
          badge?: string
          criado_em?: string
          criado_por?: string | null
          deleted_at?: string | null
          id?: string
          imagem?: string | null
          img_position?: string | null
          layout_config?: Json | null
          subtitulo?: string
          text_align?: string | null
          tipo?: string
          titulo: string
        }
        Update: {
          acao?: Json | null
          acao_link?: string
          alvo_localidades?: string[]
          ativo?: boolean
          badge?: string
          criado_em?: string
          criado_por?: string | null
          deleted_at?: string | null
          id?: string
          imagem?: string | null
          img_position?: string | null
          layout_config?: Json | null
          subtitulo?: string
          text_align?: string | null
          tipo?: string
          titulo?: string
        }
        Relationships: []
      }
      vanta_indica_templates: {
        Row: {
          ativo: boolean
          atualizado_em: string
          criado_em: string
          criado_por: string | null
          descricao: string
          form_data: Json
          id: string
          label: string
        }
        Insert: {
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          criado_por?: string | null
          descricao?: string
          form_data?: Json
          id?: string
          label: string
        }
        Update: {
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          criado_por?: string | null
          descricao?: string
          form_data?: Json
          id?: string
          label?: string
        }
        Relationships: []
      }
      variacoes_ingresso: {
        Row: {
          area: string
          area_custom: string | null
          created_at: string
          deleted_at: string | null
          genero: string
          id: string
          limite: number
          lote_id: string
          requer_comprovante: boolean
          tier_minimo: string | null
          tipo_beneficio_mv: string | null
          tipo_comprovante: string | null
          valor: number
          vendidos: number
        }
        Insert: {
          area?: string
          area_custom?: string | null
          created_at?: string
          deleted_at?: string | null
          genero?: string
          id?: string
          limite?: number
          lote_id: string
          requer_comprovante?: boolean
          tier_minimo?: string | null
          tipo_beneficio_mv?: string | null
          tipo_comprovante?: string | null
          valor?: number
          vendidos?: number
        }
        Update: {
          area?: string
          area_custom?: string | null
          created_at?: string
          deleted_at?: string | null
          genero?: string
          id?: string
          limite?: number
          lote_id?: string
          requer_comprovante?: boolean
          tier_minimo?: string | null
          tipo_beneficio_mv?: string | null
          tipo_comprovante?: string | null
          valor?: number
          vendidos?: number
        }
        Relationships: [
          {
            foreignKeyName: "variacoes_ingresso_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes"
            referencedColumns: ["id"]
          },
        ]
      }
      vendas_log: {
        Row: {
          criado_em: string | null
          evento_id: string | null
          id: string
          origem: string
          produtor_id: string | null
          ts: string
          valor: number
          variacao_id: string | null
          variacao_label: string
        }
        Insert: {
          criado_em?: string | null
          evento_id?: string | null
          id?: string
          origem?: string
          produtor_id?: string | null
          ts?: string
          valor: number
          variacao_id?: string | null
          variacao_label: string
        }
        Update: {
          criado_em?: string | null
          evento_id?: string | null
          id?: string
          origem?: string
          produtor_id?: string | null
          ts?: string
          valor?: number
          variacao_id?: string | null
          variacao_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendas_log_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_log_variacao_id_fkey"
            columns: ["variacao_id"]
            isOneToOne: false
            referencedRelation: "variacoes_ingresso"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          email: string
          evento_id: string
          id: string
          notificado_em: string | null
          user_id: string | null
          variacao_id: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          email: string
          evento_id: string
          id?: string
          notificado_em?: string | null
          user_id?: string | null
          variacao_id: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          evento_id?: string
          id?: string
          notificado_em?: string | null
          user_id?: string | null
          variacao_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_variacao_id_fkey"
            columns: ["variacao_id"]
            isOneToOne: false
            referencedRelation: "variacoes_ingresso"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_pin_lockouts: {
        Row: {
          day_lockout_count: number
          day_window_start: string | null
          fail_count: number
          fail_window_start: string | null
          locked_until: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          day_lockout_count?: number
          day_window_start?: string | null
          fail_count?: number
          fail_window_start?: string | null
          locked_until?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          day_lockout_count?: number
          day_window_start?: string | null
          fail_count?: number
          fail_window_start?: string | null
          locked_until?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      comunidades_admin: {
        Row: {
          ativa: boolean | null
          capacidade_max: number | null
          cargos_customizados: Json | null
          cep: string | null
          cidade: string | null
          cnpj: string | null
          coords: Json | null
          cota_cortesias: number | null
          cota_nomes_lista: number | null
          created_at: string | null
          created_by: string | null
          descricao: string | null
          dono_id: string | null
          endereco: string | null
          estado: string | null
          evento_privado_ativo: boolean | null
          evento_privado_atracoes: Json | null
          evento_privado_faixas_capacidade: Json | null
          evento_privado_formatos: Json | null
          evento_privado_fotos: Json | null
          evento_privado_texto: string | null
          foto: string | null
          foto_capa: string | null
          gateway_fee_mode: string | null
          horario_funcionamento: Json | null
          horario_overrides: Json | null
          id: string | null
          nome: string | null
          razao_social: string | null
          slug: string | null
          taxa_cortesia_excedente_pct: number | null
          taxa_minima: number | null
          taxa_nome_excedente: number | null
          taxa_porta_percent: number | null
          taxa_processamento_percent: number | null
          telefone: string | null
          tier_minimo_mais_vanta: string | null
          tipo_comunidade: string | null
          updated_at: string | null
          vanta_fee_fixed: number | null
          vanta_fee_percent: number | null
          vanta_fee_repasse_percent: number | null
        }
        Insert: {
          ativa?: boolean | null
          capacidade_max?: number | null
          cargos_customizados?: Json | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          coords?: Json | null
          cota_cortesias?: number | null
          cota_nomes_lista?: number | null
          created_at?: string | null
          created_by?: string | null
          descricao?: string | null
          dono_id?: string | null
          endereco?: string | null
          estado?: string | null
          evento_privado_ativo?: boolean | null
          evento_privado_atracoes?: Json | null
          evento_privado_faixas_capacidade?: Json | null
          evento_privado_formatos?: Json | null
          evento_privado_fotos?: Json | null
          evento_privado_texto?: string | null
          foto?: string | null
          foto_capa?: string | null
          gateway_fee_mode?: string | null
          horario_funcionamento?: Json | null
          horario_overrides?: Json | null
          id?: string | null
          nome?: string | null
          razao_social?: string | null
          slug?: string | null
          taxa_cortesia_excedente_pct?: number | null
          taxa_minima?: number | null
          taxa_nome_excedente?: number | null
          taxa_porta_percent?: number | null
          taxa_processamento_percent?: number | null
          telefone?: string | null
          tier_minimo_mais_vanta?: string | null
          tipo_comunidade?: string | null
          updated_at?: string | null
          vanta_fee_fixed?: number | null
          vanta_fee_percent?: number | null
          vanta_fee_repasse_percent?: number | null
        }
        Update: {
          ativa?: boolean | null
          capacidade_max?: number | null
          cargos_customizados?: Json | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          coords?: Json | null
          cota_cortesias?: number | null
          cota_nomes_lista?: number | null
          created_at?: string | null
          created_by?: string | null
          descricao?: string | null
          dono_id?: string | null
          endereco?: string | null
          estado?: string | null
          evento_privado_ativo?: boolean | null
          evento_privado_atracoes?: Json | null
          evento_privado_faixas_capacidade?: Json | null
          evento_privado_formatos?: Json | null
          evento_privado_fotos?: Json | null
          evento_privado_texto?: string | null
          foto?: string | null
          foto_capa?: string | null
          gateway_fee_mode?: string | null
          horario_funcionamento?: Json | null
          horario_overrides?: Json | null
          id?: string | null
          nome?: string | null
          razao_social?: string | null
          slug?: string | null
          taxa_cortesia_excedente_pct?: number | null
          taxa_minima?: number | null
          taxa_nome_excedente?: number | null
          taxa_porta_percent?: number | null
          taxa_processamento_percent?: number | null
          telefone?: string | null
          tier_minimo_mais_vanta?: string | null
          tipo_comunidade?: string | null
          updated_at?: string | null
          vanta_fee_fixed?: number | null
          vanta_fee_percent?: number | null
          vanta_fee_repasse_percent?: number | null
        }
        Relationships: []
      }
      comunidades_publico: {
        Row: {
          ativa: boolean | null
          capacidade_max: number | null
          cidade: string | null
          coords: Json | null
          created_at: string | null
          descricao: string | null
          endereco: string | null
          estado: string | null
          evento_privado_ativo: boolean | null
          evento_privado_atracoes: Json | null
          evento_privado_faixas_capacidade: Json | null
          evento_privado_formatos: Json | null
          evento_privado_fotos: Json | null
          evento_privado_texto: string | null
          foto: string | null
          foto_capa: string | null
          horario_funcionamento: Json | null
          horario_overrides: Json | null
          id: string | null
          nome: string | null
          slug: string | null
          tier_minimo_mais_vanta: string | null
          tipo_comunidade: string | null
          updated_at: string | null
        }
        Insert: {
          ativa?: boolean | null
          capacidade_max?: number | null
          cidade?: string | null
          coords?: Json | null
          created_at?: string | null
          descricao?: string | null
          endereco?: string | null
          estado?: string | null
          evento_privado_ativo?: boolean | null
          evento_privado_atracoes?: Json | null
          evento_privado_faixas_capacidade?: Json | null
          evento_privado_formatos?: Json | null
          evento_privado_fotos?: Json | null
          evento_privado_texto?: string | null
          foto?: string | null
          foto_capa?: string | null
          horario_funcionamento?: Json | null
          horario_overrides?: Json | null
          id?: string | null
          nome?: string | null
          slug?: string | null
          tier_minimo_mais_vanta?: string | null
          tipo_comunidade?: string | null
          updated_at?: string | null
        }
        Update: {
          ativa?: boolean | null
          capacidade_max?: number | null
          cidade?: string | null
          coords?: Json | null
          created_at?: string | null
          descricao?: string | null
          endereco?: string | null
          estado?: string | null
          evento_privado_ativo?: boolean | null
          evento_privado_atracoes?: Json | null
          evento_privado_faixas_capacidade?: Json | null
          evento_privado_formatos?: Json | null
          evento_privado_fotos?: Json | null
          evento_privado_texto?: string | null
          foto?: string | null
          foto_capa?: string | null
          horario_funcionamento?: Json | null
          horario_overrides?: Json | null
          id?: string | null
          nome?: string | null
          slug?: string | null
          tier_minimo_mais_vanta?: string | null
          tipo_comunidade?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hq_v2_briefings_gerados_view: {
        Row: {
          briefing_final_md: string | null
          card_id: string | null
          contexto_real_jsonb: Json | null
          copiado_em: string | null
          criado_em: string | null
          entregue_em: string | null
          id: string | null
          refazer_motivo: string | null
          setor_slug: string | null
          status:
            | "gerado"
            | "copiado"
            | "em_execucao"
            | "entregue"
            | "refazer"
            | "arquivado"
            | null
          texto_livre: string | null
        }
        Insert: {
          briefing_final_md?: string | null
          card_id?: string | null
          contexto_real_jsonb?: Json | null
          copiado_em?: string | null
          criado_em?: string | null
          entregue_em?: string | null
          id?: string | null
          refazer_motivo?: string | null
          setor_slug?: string | null
          status?:
            | "gerado"
            | "copiado"
            | "em_execucao"
            | "entregue"
            | "refazer"
            | "arquivado"
            | null
          texto_livre?: string | null
        }
        Update: {
          briefing_final_md?: string | null
          card_id?: string | null
          contexto_real_jsonb?: Json | null
          copiado_em?: string | null
          criado_em?: string | null
          entregue_em?: string | null
          id?: string | null
          refazer_motivo?: string | null
          setor_slug?: string | null
          status?:
            | "gerado"
            | "copiado"
            | "em_execucao"
            | "entregue"
            | "refazer"
            | "arquivado"
            | null
          texto_livre?: string | null
        }
        Relationships: []
      }
      hq_v2_cards_view: {
        Row: {
          ativo: boolean | null
          id: string | null
          o_que_entrega: string | null
          ordem: number | null
          quando_usar: string | null
          query_contexto_jsonb: Json | null
          setor_slug: string | null
          template_briefing_md: string | null
          titulo: string | null
        }
        Insert: {
          ativo?: boolean | null
          id?: string | null
          o_que_entrega?: string | null
          ordem?: number | null
          quando_usar?: string | null
          query_contexto_jsonb?: Json | null
          setor_slug?: string | null
          template_briefing_md?: string | null
          titulo?: string | null
        }
        Update: {
          ativo?: boolean | null
          id?: string | null
          o_que_entrega?: string | null
          ordem?: number | null
          quando_usar?: string | null
          query_contexto_jsonb?: Json | null
          setor_slug?: string | null
          template_briefing_md?: string | null
          titulo?: string | null
        }
        Relationships: []
      }
      hq_v2_setores_view: {
        Row: {
          ativo: boolean | null
          funcao: string | null
          id: string | null
          nome: string | null
          ordem: number | null
          slug: string | null
        }
        Insert: {
          ativo?: boolean | null
          funcao?: string | null
          id?: string | null
          nome?: string | null
          ordem?: number | null
          slug?: string | null
        }
        Update: {
          ativo?: boolean | null
          funcao?: string | null
          id?: string | null
          nome?: string | null
          ordem?: number | null
          slug?: string | null
        }
        Relationships: []
      }
      mv_alcance_comunidade: {
        Row: {
          alcance_automatico_total: number | null
          alcance_boost_total: number | null
          alcance_total: number | null
          comunidade_id: string | null
          comunidade_nome: string | null
          configs_ativos: number | null
        }
        Relationships: []
      }
      mv_alcance_evento: {
        Row: {
          alcance_automatico: number | null
          alcance_boost: number | null
          alcance_total: number | null
          config_id: string | null
          evento_id: string | null
          evento_nome: string | null
          tier_minimo: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mais_vanta_lotes_evento_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
        ]
      }
      mv_resgate_performance: {
        Row: {
          comunidade_id: string | null
          comunidade_nome: string | null
          comunidade_slug: string | null
          config_id: string | null
          data_inicio: string | null
          evento_id: string | null
          evento_nome: string | null
          horas_ate_evento: number | null
          pct_resgate: number | null
          status: string | null
          tier_minimo: string | null
          tipo_beneficio: string | null
          vagas_limite: number | null
          vagas_resgatadas: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mais_vanta_lotes_evento_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
        ]
      }
      mv_resgates_recentes_comunidade: {
        Row: {
          comunidade_id: string | null
          evento_data: string | null
          evento_id: string | null
          evento_nome: string | null
          membro_avatar: string | null
          membro_nome: string | null
          rating_produtor: number | null
          resgatado_em: string | null
          resgate_id: string | null
          status: string | null
          tier_snapshot: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_admin_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_admin_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_admin_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_admin_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "eventos_admin_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "resgates_mv_evento_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resgates_mv_evento_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mv_top_frequentadores_comunidade: {
        Row: {
          comunidade_id: string | null
          membro_avatar: string | null
          membro_nome: string | null
          negativos: number | null
          positivos: number | null
          rating_score: number | null
          resgates_cancelados: number | null
          total_resgates: number | null
          ultimo_resgate: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_admin_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_admin_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_admin_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "comunidades_publico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_admin_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_alcance_comunidade"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "eventos_admin_comunidade_id_fkey"
            columns: ["comunidade_id"]
            isOneToOne: false
            referencedRelation: "mv_resgate_performance"
            referencedColumns: ["comunidade_id"]
          },
          {
            foreignKeyName: "resgates_mv_evento_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      aceitar_convite_mv: { Args: { p_token: string }; Returns: Json }
      aceitar_convite_socio: { Args: { p_evento_id: string }; Returns: Json }
      aceitar_cortesia_rpc: { Args: { p_cortesia_id: string }; Returns: Json }
      aceitar_transferencia: {
        Args: { p_transferencia_id: string; p_user_id: string }
        Returns: Json
      }
      admin_chargeback_insert: {
        Args: { p_gateway_ref?: string; p_motivo?: string; p_ticket_id: string }
        Returns: Json
      }
      admin_evento_demografico: { Args: { p_evento_id: string }; Returns: Json }
      admin_get_profiles_bulk: {
        Args: { p_user_ids: string[] }
        Returns: {
          avatar_url: string
          cidade: string
          email: string
          id: string
          nome: string
          role: string
          telefone_ddd: string
          telefone_numero: string
        }[]
      }
      admin_list_comunidades: {
        Args: { p_limit?: number }
        Returns: {
          ativa: boolean
          capacidade_max: number
          cargos_customizados: Json
          cep: string
          cidade: string
          cnpj: string
          condicoes_aceitas_em: string
          condicoes_status: string
          coords: Json
          cota_cortesias: number
          cota_nomes_lista: number
          created_at: string
          created_by: string
          descricao: string
          dono_id: string
          endereco: string
          estado: string
          evento_privado_ativo: boolean
          evento_privado_atracoes: Json
          evento_privado_faixas_capacidade: Json
          evento_privado_formatos: Json
          evento_privado_fotos: Json
          evento_privado_texto: string
          foto: string
          foto_capa: string
          gateway_fee_mode: string
          horario_funcionamento: Json
          horario_overrides: Json
          id: string
          instagram: string
          limite_notificacoes_mes: number
          nome: string
          onboarding_completo: boolean
          razao_social: string
          site: string
          slug: string
          taxa_cortesia_excedente_pct: number
          taxa_minima: number
          taxa_nome_excedente: number
          taxa_porta_percent: number
          taxa_processamento_percent: number
          telefone: string
          tier_minimo_mais_vanta: string
          tiktok: string
          tipo_comunidade: string
          updated_at: string
          vanta_fee_fixed: number
          vanta_fee_percent: number
          vanta_fee_repasse_percent: number
          whatsapp: string
        }[]
      }
      admin_list_eventos_recentes: {
        Args: { p_cutoff?: string; p_limit?: number }
        Returns: {
          caixa_ativo: boolean
          cancelamento_etapa: string
          cancelamento_motivo: string
          cancelamento_solicitado_por: string
          categoria: string
          cidade: string
          classificacao_etaria: string
          codigo_afiliado: string
          comissao_vanta: number
          comunidade_id: string
          coords: Json
          cota_cortesias: number
          cota_nomes_lista: number
          created_at: string
          created_by: string
          custos_fixos: number
          data_fim: string
          data_inicio: string
          deleted_at: string
          descricao: string
          edicao_motivo: string
          edicao_pendente: Json
          edicao_status: string
          endereco: string
          estilos: string[]
          evento_origem_id: string
          experiencias: string[]
          formato: string
          foto: string
          gateway_fee_mode: string
          id: string
          idade_minima: number
          link_externo: string
          local: string
          mesas_ativo: boolean
          motivo_rejeicao: string
          mv_avaliacao: string
          nome: string
          permissoes_produtor: string[]
          planta_mesas: string
          plataforma_externa: string
          politica_reembolso: string
          prazo_pagamento_dias: number
          prazo_reembolso_dias: number
          proposta_mensagem: string
          proposta_rodada: number
          proposta_status: string
          publicado: boolean
          quem_paga_servico: string
          recorrencia: string
          recorrencia_ate: string
          rejeicao_campos: Json
          rodada_negociacao: number
          rodada_rejeicao: number
          slug: string
          socio_convidado_id: string
          split_produtor: number
          split_socio: number
          status_evento: string
          subcategorias: string[]
          taxa_cortesia_excedente_pct: number
          taxa_fixa_evento: number
          taxa_minima: number
          taxa_nome_excedente: number
          taxa_override: number
          taxa_porta_percent: number
          taxa_processamento_percent: number
          tipo_fluxo: string
          updated_at: string
          vanta_fee_fixed: number
          vanta_fee_percent: number
          venda_vanta: boolean
        }[]
      }
      admin_manage_user: {
        Args: { p_action: string; p_user_id: string; p_value?: string }
        Returns: Json
      }
      admin_pagamento_promoter_insert: {
        Args: {
          p_cota_id: string
          p_evento_id: string
          p_observacao?: string
          p_promoter_id: string
          p_valor: number
        }
        Returns: Json
      }
      admin_pendencia_write: {
        Args: {
          p_action: string
          p_agente_responsavel?: string
          p_dependencias?: string[]
          p_descricao?: string
          p_grupo?: string
          p_numero?: string
          p_prioridade?: string
          p_resolved_commit?: string
          p_resolved_session?: string
          p_sessao_origem?: string
          p_setor?: string
          p_tags?: string[]
          p_titulo?: string
        }
        Returns: Json
      }
      admin_profile_update: {
        Args: { p_fields: Json; p_user_id: string }
        Returns: Json
      }
      admin_reembolso_write:
        | {
            Args: {
              p_action: string
              p_aprovado_por?: string
              p_evento_id?: string
              p_motivo?: string
              p_motivo_rejeicao?: string
              p_processado_em?: string
              p_reembolso_id?: string
              p_rejeitado_por?: string
              p_solicitado_por?: string
              p_status?: string
              p_stripe_refund_id?: string
              p_ticket_id?: string
              p_tipo?: string
              p_valor?: number
            }
            Returns: Json
          }
        | {
            Args: {
              p_action: string
              p_aprovado_por?: string
              p_etapa?: string
              p_evento_id?: string
              p_gerente_decisao?: string
              p_gerente_decisao_em?: string
              p_gerente_id?: string
              p_motivo?: string
              p_motivo_rejeicao?: string
              p_processado_em?: string
              p_reembolso_id?: string
              p_rejeitado_por?: string
              p_socio_decisao?: string
              p_socio_decisao_em?: string
              p_socio_id?: string
              p_solicitado_por?: string
              p_status?: string
              p_stripe_refund_id?: string
              p_ticket_id?: string
              p_tipo?: string
              p_updated_at?: string
              p_valor?: number
            }
            Returns: Json
          }
      admin_saque_write: {
        Args: {
          p_action: string
          p_comprovante_url?: string
          p_evento_id?: string
          p_gerente_id?: string
          p_motivo_recusa?: string
          p_pix_chave?: string
          p_pix_tipo?: string
          p_produtor_id?: string
          p_saque_id?: string
          p_valor?: number
          p_valor_liquido?: number
          p_valor_taxa?: number
        }
        Returns: Json
      }
      admin_search_profiles: {
        Args: { p_limit?: number; p_q: string }
        Returns: {
          avatar_url: string
          cidade: string
          email: string
          id: string
          nome: string
          role: string
        }[]
      }
      admin_ticket_write:
        | {
            Args: {
              p_action: string
              p_email?: string
              p_evento_id?: string
              p_nome_titular?: string
              p_selfie_url?: string
              p_status?: string
              p_ticket_id?: string
              p_valor?: number
              p_variacao_id?: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_action: string
              p_cpf?: string
              p_email?: string
              p_evento_id?: string
              p_nome_titular?: string
              p_observacao?: string
              p_owner_id?: string
              p_selfie_url?: string
              p_status?: string
              p_ticket_id?: string
              p_validacao_forcada?: boolean
              p_validado_por_nome?: string
              p_valor?: number
              p_variacao_id?: string
            }
            Returns: Json
          }
      anonimizar_conta: { Args: never; Returns: undefined }
      ativar_mv_evento: {
        Args: { p_beneficios: Json; p_evento_id: string }
        Returns: Json
      }
      atualizar_eventos_teste: { Args: never; Returns: undefined }
      atualizar_username: { Args: { p_username: string }; Returns: Json }
      buscar_membros: {
        Args: { max_results?: number; search_query: string }
        Returns: {
          cidade: string
          email: string
          foto: string
          id: string
          instagram: string
          nome: string
          role: string
        }[]
      }
      buscar_perfil_publico: { Args: { p_username: string }; Returns: Json }
      cancelar_evento: {
        Args: { p_evento_id: string; p_motivo?: string }
        Returns: Json
      }
      cancelar_serie_recorrente: {
        Args: { p_evento_origem_id: string }
        Returns: number
      }
      check_rate_limit: {
        Args: { p_key: string; p_max?: number; p_window_seconds?: number }
        Returns: boolean
      }
      check_wallet_pin_allowed: { Args: { p_user_id: string }; Returns: Json }
      checkout_gratuito: {
        Args: { p_comprador_id: string; p_email?: string; p_evento_id: string }
        Returns: Json
      }
      cidades_com_eventos: {
        Args: { p_excluir?: string }
        Returns: {
          cidade: string
          foto_destaque: string
          total_eventos: number
        }[]
      }
      cleanup_telemetry_internal: {
        Args: never
        Returns: {
          cron_deleted: number
          pg_net_deleted: number
        }[]
      }
      create_connect_account: {
        Args: {
          p_account_id: string
          p_comunidade_id: string
          p_onboarding_url: string
        }
        Returns: Json
      }
      criar_comunidade_completa: {
        Args: { p_comunidade: Json; p_produtores?: string[] }
        Returns: Json
      }
      criar_evento_completo: {
        Args: {
          p_equipe?: Json
          p_evento: Json
          p_lotes?: Json
          p_socios?: Json
        }
        Returns: Json
      }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      dashboard_community_kpis: {
        Args: { p_comunidade_id: string }
        Returns: {
          faturamento: number
          total_eventos: number
          total_ingressos: number
        }[]
      }
      dashboard_faturamento_por_comunidade: {
        Args: never
        Returns: {
          comunidade_id: string
          comunidade_nome: string
          faturamento: number
        }[]
      }
      dashboard_resumo_total: {
        Args: never
        Returns: {
          comunidades_ativas: number
          eventos_publicados: number
          tickets_vendidos: number
          total_comunidades: number
          total_eventos: number
        }[]
      }
      enviar_lembretes_evento: { Args: never; Returns: undefined }
      estilos_por_cidade: {
        Args: { p_cidade: string }
        Returns: {
          estilo: string
        }[]
      }
      eventos_com_beneficio_mv: {
        Args: {
          p_cidade: string
          p_creator_sublevel?: string
          p_limit?: number
          p_offset?: number
          p_tier: string
        }
        Returns: {
          desconto_percentual: number
          evento_id: string
          tipo_beneficio: string
        }[]
      }
      eventos_por_cidade_paginado: {
        Args: {
          p_cidade: string
          p_futuros?: boolean
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          evento_id: string
        }[]
      }
      eventos_recomendados_behavior: {
        Args: { p_cidade: string; p_limit?: number; p_user_id: string }
        Returns: {
          caixa_ativo: boolean
          cancelamento_etapa: string | null
          cancelamento_motivo: string | null
          cancelamento_solicitado_por: string | null
          categoria: string | null
          cidade: string | null
          classificacao_etaria: string
          codigo_afiliado: string | null
          comissao_vanta: number | null
          comunidade_id: string | null
          coords: Json | null
          cota_cortesias: number | null
          cota_nomes_lista: number | null
          created_at: string
          created_by: string | null
          custos_fixos: number | null
          data_fim: string | null
          data_inicio: string
          deleted_at: string | null
          descricao: string
          edicao_motivo: string | null
          edicao_pendente: Json | null
          edicao_status: string | null
          endereco: string | null
          estilos: string[] | null
          evento_origem_id: string | null
          experiencias: string[] | null
          formato: string | null
          foto: string | null
          gateway_fee_mode: string
          id: string
          idade_minima: number | null
          link_externo: string | null
          local: string
          mesas_ativo: boolean | null
          motivo_rejeicao: string | null
          mv_avaliacao: string | null
          nome: string
          permissoes_produtor: string[] | null
          planta_mesas: string | null
          plataforma_externa: string | null
          politica_reembolso: string | null
          prazo_pagamento_dias: number | null
          prazo_reembolso_dias: number | null
          proposta_mensagem: string | null
          proposta_rodada: number | null
          proposta_status: string | null
          publicado: boolean
          quem_paga_servico: string | null
          recorrencia: string
          recorrencia_ate: string | null
          rejeicao_campos: Json | null
          rodada_negociacao: number | null
          rodada_rejeicao: number | null
          slug: string | null
          socio_convidado_id: string | null
          split_produtor: number | null
          split_socio: number | null
          status_evento: string | null
          subcategorias: string[] | null
          taxa_cortesia_excedente_pct: number | null
          taxa_fixa_evento: number | null
          taxa_minima: number | null
          taxa_nome_excedente: number | null
          taxa_override: number | null
          taxa_porta_percent: number | null
          taxa_processamento_percent: number | null
          tipo_fluxo: string | null
          updated_at: string
          vanta_fee_fixed: number
          vanta_fee_percent: number | null
          venda_vanta: boolean | null
        }[]
        SetofOptions: {
          from: "*"
          to: "eventos_admin"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      expirar_cortesias_pendentes: { Args: never; Returns: undefined }
      expirar_pedidos_checkout_pendentes: { Args: never; Returns: undefined }
      expirar_transferencias_pendentes: { Args: never; Returns: undefined }
      exportar_dados_usuario: { Args: never; Returns: Json }
      finalizar_eventos_expirados: { Args: never; Returns: undefined }
      generate_ticket_qr: { Args: { p_ticket_id: string }; Returns: string }
      gerar_cortesias_comemoracao: {
        Args: { p_comemoracao_id: string }
        Returns: undefined
      }
      gerar_ocorrencias_recorrente: {
        Args: {
          p_copiar_equipe?: boolean
          p_copiar_listas?: boolean
          p_copiar_lotes?: boolean
          p_evento_id: string
        }
        Returns: number
      }
      get_admin_access: { Args: { p_user_id: string }; Returns: Json }
      get_comunidades_cargos_customizados: {
        Args: never
        Returns: {
          cargos_customizados: Json
          id: string
        }[]
      }
      get_cron_status: {
        Args: { p_job_names: string[] }
        Returns: {
          failures_24h: number
          job_name: string
          last_failure: string
          last_return_message: string
          last_start: string
          last_status: string
        }[]
      }
      get_evento_from_lista: { Args: { p_lista_id: string }; Returns: string }
      get_evento_from_lote: { Args: { p_lote_id: string }; Returns: string }
      get_eventos_por_regiao: {
        Args: { p_lat: number; p_lng: number; p_raio_km?: number }
        Returns: {
          caixa_ativo: boolean
          cancelamento_etapa: string | null
          cancelamento_motivo: string | null
          cancelamento_solicitado_por: string | null
          categoria: string | null
          cidade: string | null
          classificacao_etaria: string
          codigo_afiliado: string | null
          comissao_vanta: number | null
          comunidade_id: string | null
          coords: Json | null
          cota_cortesias: number | null
          cota_nomes_lista: number | null
          created_at: string
          created_by: string | null
          custos_fixos: number | null
          data_fim: string | null
          data_inicio: string
          deleted_at: string | null
          descricao: string
          edicao_motivo: string | null
          edicao_pendente: Json | null
          edicao_status: string | null
          endereco: string | null
          estilos: string[] | null
          evento_origem_id: string | null
          experiencias: string[] | null
          formato: string | null
          foto: string | null
          gateway_fee_mode: string
          id: string
          idade_minima: number | null
          link_externo: string | null
          local: string
          mesas_ativo: boolean | null
          motivo_rejeicao: string | null
          mv_avaliacao: string | null
          nome: string
          permissoes_produtor: string[] | null
          planta_mesas: string | null
          plataforma_externa: string | null
          politica_reembolso: string | null
          prazo_pagamento_dias: number | null
          prazo_reembolso_dias: number | null
          proposta_mensagem: string | null
          proposta_rodada: number | null
          proposta_status: string | null
          publicado: boolean
          quem_paga_servico: string | null
          recorrencia: string
          recorrencia_ate: string | null
          rejeicao_campos: Json | null
          rodada_negociacao: number | null
          rodada_rejeicao: number | null
          slug: string | null
          socio_convidado_id: string | null
          split_produtor: number | null
          split_socio: number | null
          status_evento: string | null
          subcategorias: string[] | null
          taxa_cortesia_excedente_pct: number | null
          taxa_fixa_evento: number | null
          taxa_minima: number | null
          taxa_nome_excedente: number | null
          taxa_override: number | null
          taxa_porta_percent: number | null
          taxa_processamento_percent: number | null
          tipo_fluxo: string | null
          updated_at: string
          vanta_fee_fixed: number
          vanta_fee_percent: number | null
          venda_vanta: boolean | null
        }[]
        SetofOptions: {
          from: "*"
          to: "eventos_admin"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_ocorrencias_serie: {
        Args: { p_evento_origem_id: string }
        Returns: {
          data_fim: string
          data_inicio: string
          id: string
          publicado: boolean
          status_evento: string
          total_vendidos: number
        }[]
      }
      get_own_preferencias: { Args: never; Returns: Json }
      get_own_profile: {
        Args: never
        Returns: {
          album_urls: string[]
          avatar_url: string
          biografia: string
          cidade: string
          cpf: string
          data_nascimento: string
          email: string
          estado: string
          genero: string
          id: string
          instagram: string
          instagram_followers: number
          interesses: string[]
          nome: string
          privacidade: Json
          role: string
          telefone_ddd: string
          telefone_numero: string
          username: string
        }[]
      }
      get_public_event_by_slug: {
        Args: { p_slug: string }
        Returns: {
          categoria: string
          cidade: string
          classificacao_etaria: string
          comunidade_id: string
          coords: Json
          data_fim: string
          data_inicio: string
          descricao: string
          endereco: string
          estilos: string[]
          foto: string
          id: string
          local: string
          lotes: Json
          mais_vanta_config_evento: Json
          nome: string
          publicado: boolean
          slug: string
          status_evento: string
        }[]
      }
      get_public_events_optimized: {
        Args: { p_cidade?: string; p_limit?: number; p_offset?: number }
        Returns: {
          categoria: string
          cidade: string
          classificacao_etaria: string
          comunidade_id: string
          coords: Json
          data_fim: string
          data_inicio: string
          descricao: string
          endereco: string
          estilos: string[]
          foto: string
          id: string
          local: string
          lotes: Json
          mais_vanta_config_evento: Json
          nome: string
          publicado: boolean
          slug: string
          status_evento: string
        }[]
      }
      get_saldo_financeiro: { Args: { p_evento_id: string }; Returns: Json }
      get_server_timestamp: { Args: never; Returns: string }
      get_ticket_receipt: {
        Args: { p_ticket_id: string }
        Returns: {
          comunidade_id: string
          comunidade_nome: string
          cpf_titular: string
          cupom_codigo: string
          desconto_cupom_valor: number
          email: string
          evento_cidade: string
          evento_data_fim: string
          evento_data_inicio: string
          evento_id: string
          evento_local: string
          evento_nome: string
          lote_label: string
          metodo_pagamento: string
          nome_titular: string
          pedido_id: string
          taxa_aplicada: number
          ticket_criado_em: string
          ticket_id: string
          ticket_status: string
          transaction_created_at: string
          transaction_id: string
          transaction_status: string
          transaction_tipo: string
          valor_bruto: number
          valor_liquido: number
          valor_ticket: number
          variacao_label: string
        }[]
      }
      get_user_eventos_confirmados: {
        Args: { p_limit?: number; p_only_future?: boolean; p_user_id: string }
        Returns: {
          cidade: string
          comunidade_foto: string
          comunidade_id: string
          comunidade_nome: string
          data_fim: string
          data_inicio: string
          evento_id: string
          foto: string
          local: string
          nome: string
          status_evento: string
          ticket_status: string
        }[]
      }
      has_analytics_access: {
        Args: { p_community_id?: string; p_event_id?: string }
        Returns: boolean
      }
      has_comunidade_access: {
        Args: { p_comunidade_id: string }
        Returns: boolean
      }
      has_comunidade_write_access: {
        Args: { p_tenant_id: string; p_tenant_type: string }
        Returns: boolean
      }
      has_cortesias_access: { Args: { p_event_id: string }; Returns: boolean }
      has_cupons_access: {
        Args: { p_community_id?: string; p_event_id?: string }
        Returns: boolean
      }
      has_evento_access: { Args: { p_evento_id: string }; Returns: boolean }
      has_plataforma_permission: {
        Args: { p_permissao: string }
        Returns: boolean
      }
      has_wallet_pin: { Args: never; Returns: boolean }
      hq_recalcular_feature_analysis: { Args: never; Returns: Json }
      hq_v2_briefing_criar: {
        Args: {
          p_briefing_final_md?: string
          p_card_id?: string
          p_contexto_real_jsonb?: Json
          p_setor_slug: string
          p_texto_livre?: string
        }
        Returns: unknown
        SetofOptions: {
          from: "*"
          to: "briefings_gerados"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      hq_v2_briefing_marcar_copiado: {
        Args: { p_briefing_id: string }
        Returns: unknown
        SetofOptions: {
          from: "*"
          to: "briefings_gerados"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      hq_v2_cifrar_dump_base64: {
        Args: { payload_b64: string }
        Returns: string
      }
      hq_v2_decifrar_dump_base64: {
        Args: { cifrado_b64: string }
        Returns: string
      }
      hq_v2_listar_tabelas_public: {
        Args: never
        Returns: {
          tabela: string
        }[]
      }
      hq_v2_q_eventos_proximas_48h: { Args: never; Returns: Json }
      incrementar_usos_cupom: { Args: { cupom_id: string }; Returns: undefined }
      incrementar_usos_cupom_por_codigo: {
        Args: { p_codigo: string; p_evento_id: string }
        Returns: undefined
      }
      inserir_notificacao: {
        Args: {
          p_link?: string
          p_mensagem: string
          p_push_data?: Json
          p_send_email?: boolean
          p_send_push?: boolean
          p_tipo: string
          p_titulo: string
          p_user_id: string
        }
        Returns: string
      }
      is_comunidade_creator: {
        Args: { p_comunidade_id: string }
        Returns: boolean
      }
      is_comunidade_gerente_via_evento: {
        Args: { p_evento_id: string }
        Returns: boolean
      }
      is_comunidade_owner: {
        Args: { p_comunidade_id: string }
        Returns: boolean
      }
      is_comunidade_team: {
        Args: { p_comunidade_id: string }
        Returns: boolean
      }
      is_event_manager_or_admin: {
        Args: { p_evento_id: string }
        Returns: boolean
      }
      is_event_team_member: { Args: { p_evento_id: string }; Returns: boolean }
      is_evento_creator: { Args: { p_evento_id: string }; Returns: boolean }
      is_friend: { Args: { uid_a: string; uid_b: string }; Returns: boolean }
      is_masteradm: { Args: never; Returns: boolean }
      is_membro_clube: { Args: { check_user_id: string }; Returns: boolean }
      is_parceiro_owner: { Args: { p_parceiro_id: string }; Returns: boolean }
      is_produtor_evento: { Args: { p_evento_id: string }; Returns: boolean }
      is_tenant_member: {
        Args: { p_cargos: string[]; p_tenant_id: string; p_tenant_type: string }
        Returns: boolean
      }
      is_valid_cpf: { Args: { p_cpf: string }; Returns: boolean }
      is_valid_ddd: { Args: { p_ddd: string }; Returns: boolean }
      is_valid_telefone_numero: { Args: { p_numero: string }; Returns: boolean }
      liberar_mesa: { Args: { p_mesa_id: string }; Returns: undefined }
      mv_aprovar_reentrada: {
        Args: {
          p_decisao: string
          p_motivo_decisao?: string
          p_reentrada_id: string
        }
        Returns: undefined
      }
      mv_boost_notify: {
        Args: { p_config_id: string; p_filtros?: Json }
        Returns: Json
      }
      mv_cancelar_assinatura: {
        Args: { p_assinatura_id: string }
        Returns: Json
      }
      mv_get_all_membros_admin: {
        Args: never
        Returns: {
          alcance: string | null
          aprovado_em: string
          aprovado_por: string
          ativo: boolean
          banido_em: string | null
          banido_permanente: boolean | null
          bloqueio_ate: string | null
          bloqueio_nivel: number | null
          castigo_ate: string | null
          castigo_motivo: string | null
          categoria: string | null
          cidade_base: string | null
          cidade_principal: string | null
          cidades_ativas: string[] | null
          comunidade_origem: string | null
          convidado_por: string | null
          convites_disponiveis: number | null
          convites_usados: number | null
          creator_sublevel: string | null
          expulsoes_total: number
          genero: string | null
          id: string
          instagram_handle: string | null
          instagram_seguidores: number | null
          instagram_verificado: boolean | null
          instagram_verificado_em: string | null
          interesses: string[] | null
          meta_user_id: string | null
          nota_engajamento: number | null
          nota_interna: string | null
          status: string
          tags: string[] | null
          tier: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "membros_clube"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      mv_get_all_parceiros_admin: {
        Args: never
        Returns: {
          ativo: boolean
          cidade_id: string
          contato_email: string | null
          contato_nome: string | null
          contato_telefone: string | null
          coords: Json | null
          criado_em: string
          criado_por: string
          descricao: string | null
          endereco: string | null
          foto_url: string | null
          id: string
          instagram_handle: string | null
          nome: string
          plano: string
          plano_fim: string | null
          plano_inicio: string | null
          resgates_mes_limite: number
          resgates_mes_usados: number
          tipo: string
          trial_ativo: boolean
          user_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "parceiros_mais_vanta"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      mv_get_all_passports_admin: {
        Args: never
        Returns: {
          cidade: string | null
          comunidade_id: string | null
          id: string
          resolvido_em: string | null
          resolvido_por: string | null
          solicitado_em: string
          status: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "passport_aprovacoes"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      mv_get_all_solicitacoes_admin: {
        Args: never
        Returns: {
          balde_sugerido: string | null
          cidade: string | null
          codigo_verificacao: string | null
          como_conheceu: string | null
          convidado_por: string | null
          convite_id: string | null
          criado_em: string
          frequencia: string | null
          id: string
          indicado_por: string | null
          instagram_handle: string
          instagram_seguidores: number | null
          instagram_verificado: boolean | null
          instagram_verificado_em: string | null
          profissao: string | null
          resolvido_em: string | null
          resolvido_por: string | null
          status: string
          tier_atribuido: string | null
          tier_pre_atribuido: string | null
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "solicitacoes_clube"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      mv_get_all_tiers_admin: {
        Args: never
        Returns: {
          ativo: boolean
          beneficios: string[]
          cor: string
          criado_em: string | null
          id: string
          limite_mensal: number
          nome: string
          ordem: number
        }[]
        SetofOptions: {
          from: "*"
          to: "tiers_mais_vanta"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      mv_get_beneficio_detail: {
        Args: { p_evento_id: string }
        Returns: {
          config_id: string
          desconto_percentual: number
          formato_entrada: string
          tipo: string
          vagas_restantes: number
        }[]
      }
      mv_get_best_desconto_evento: {
        Args: { p_evento_id: string }
        Returns: number
      }
      mv_get_config_evento_admin: {
        Args: { p_evento_id: string }
        Returns: {
          ativo: boolean
          created_at: string
          creator_sublevel_minimo: string | null
          deleted_at: string | null
          desconto_percentual: number | null
          evento_id: string
          formato_entrada: string
          id: string
          lista_id: string | null
          lote_id: string | null
          obrigacoes: Json
          tier_minimo: string
          tipo: string
          vagas_limite: number | null
          vagas_resgatadas: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "mais_vanta_config_evento"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      mv_get_eventos_elegiveis: {
        Args: never
        Returns: {
          config_id: string
          desconto_percentual: number
          evento_id: string
          formato_entrada: string
          tipo: string
          vagas_restantes: number
        }[]
      }
      mv_get_membro_self: { Args: never; Returns: Json }
      mv_get_parceiro_admin: {
        Args: { p_id: string }
        Returns: {
          ativo: boolean
          cidade_id: string
          contato_email: string | null
          contato_nome: string | null
          contato_telefone: string | null
          coords: Json | null
          criado_em: string
          criado_por: string
          descricao: string | null
          endereco: string | null
          foto_url: string | null
          id: string
          instagram_handle: string | null
          nome: string
          plano: string
          plano_fim: string | null
          plano_inicio: string | null
          resgates_mes_limite: number
          resgates_mes_usados: number
          tipo: string
          trial_ativo: boolean
          user_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "parceiros_mais_vanta"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      mv_get_tier_user: { Args: { p_user_id: string }; Returns: string }
      mv_is_membro: { Args: { p_user_id: string }; Returns: boolean }
      mv_pedir_reentrada: { Args: { p_motivo?: string }; Returns: string }
      mv_rate_membro_resgate: {
        Args: { p_rating: number; p_resgate_id: string }
        Returns: undefined
      }
      mv_run_alert_performance: { Args: never; Returns: number }
      mv_run_lembrete_renovacao: { Args: never; Returns: number }
      mv_run_relatorio_mensal: { Args: never; Returns: number }
      mv_run_upsell_automatico: { Args: never; Returns: number }
      notificar_lembrete_reserva_mv: { Args: never; Returns: undefined }
      parceiros_por_cidade: {
        Args: { p_cidade: string; p_limit?: number; p_offset?: number }
        Returns: {
          cidade: string
          endereco: string
          foto: string
          id: string
          nome: string
          slug: string
          tipo_comunidade: string
        }[]
      }
      processar_compra_checkout: {
        Args: {
          p_comprador_id?: string
          p_email: string
          p_evento_id: string
          p_lote_id: string
          p_mv_desconto_aplicado?: boolean
          p_quantidade?: number
          p_ref_code?: string
          p_taxa?: number
          p_valor_unit: number
          p_variacao_id: string
        }
        Returns: Json
      }
      processar_compra_free_batch: {
        Args: {
          p_comprador_id?: string
          p_cupom_codigo?: string
          p_email: string
          p_evento_id: string
          p_itens: Json
          p_lote_id: string
          p_ref_code?: string
        }
        Returns: Json
      }
      processar_venda_caixa:
        | {
            Args: {
              p_email: string
              p_evento_id: string
              p_lote_id: string
              p_taxa?: number
              p_valor_unit: number
              p_variacao_id: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_email: string
              p_evento_id: string
              p_lote_id: string
              p_metodo_pagamento?: string
              p_taxa?: number
              p_valor_unit: number
              p_variacao_id: string
            }
            Returns: Json
          }
      queimar_ingresso: {
        Args: {
          p_event_id: string
          p_operador_id?: string
          p_ticket_id: string
        }
        Returns: Json
      }
      rbac_cargo_rank: { Args: { p_cargo: string }; Returns: number }
      record_wallet_pin_failure: { Args: { p_user_id: string }; Returns: Json }
      record_wallet_pin_success: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      recusar_transferencia: {
        Args: { p_transferencia_id: string; p_user_id: string }
        Returns: boolean
      }
      renovar_creditos_mv: { Args: { p_assinatura_id: string }; Returns: Json }
      reservar_mesa: {
        Args: { p_evento_id: string; p_mesa_id: string; p_user_id: string }
        Returns: Json
      }
      resgatar_beneficio_mv: { Args: { p_config_id: string }; Returns: Json }
      restore_bloqueio: { Args: { p_id: string }; Returns: boolean }
      restore_comemoracao_faixa: { Args: { p_id: string }; Returns: boolean }
      restore_convidado_lista: { Args: { p_id: string }; Returns: boolean }
      restore_cupom: { Args: { p_id: string }; Returns: boolean }
      restore_draft: { Args: { p_id: string }; Returns: boolean }
      restore_equipe_evento: { Args: { p_id: string }; Returns: boolean }
      restore_friendship: { Args: { p_id: string }; Returns: boolean }
      restore_infracao_mais_vanta: { Args: { p_id: string }; Returns: boolean }
      restore_lote: { Args: { p_id: string }; Returns: boolean }
      restore_mais_vanta_config_evento: {
        Args: { p_id: string }
        Returns: boolean
      }
      restore_mesa: { Args: { p_id: string }; Returns: boolean }
      restore_notification: { Args: { p_id: string }; Returns: boolean }
      restore_push_subscription: { Args: { p_id: string }; Returns: boolean }
      restore_push_template: { Args: { p_id: string }; Returns: boolean }
      restore_site_content: { Args: { p_key: string }; Returns: boolean }
      restore_vanta_indica: { Args: { p_id: string }; Returns: boolean }
      restore_variacao_ingresso: { Args: { p_id: string }; Returns: boolean }
      search_users: {
        Args: { p_limit?: number; p_offset?: number; p_query: string }
        Returns: {
          avatar_url: string
          cidade: string
          email: string
          id: string
          instagram: string
          nome: string
          role: string
        }[]
      }
      seed_eventos_home_vitrine: { Args: never; Returns: undefined }
      set_contracted_fees: {
        Args: { p_fields: Json; p_target_id: string; p_target_type: string }
        Returns: Json
      }
      sign_ticket_token: { Args: { p_ticket_id: string }; Returns: string }
      soft_delete_bloqueio: {
        Args: { p_bloqueado_id: string }
        Returns: boolean
      }
      soft_delete_comemoracao_faixa: {
        Args: { p_id: string }
        Returns: boolean
      }
      soft_delete_convidado_lista: { Args: { p_id: string }; Returns: boolean }
      soft_delete_cupom: { Args: { p_id: string }; Returns: boolean }
      soft_delete_draft: { Args: { p_id: string }; Returns: boolean }
      soft_delete_drafts_self_by_tipo: {
        Args: { p_tipo: string }
        Returns: number
      }
      soft_delete_equipe_by_evento: {
        Args: { p_evento_id: string }
        Returns: number
      }
      soft_delete_equipe_evento: { Args: { p_id: string }; Returns: boolean }
      soft_delete_friendship_with: {
        Args: { p_other_id: string }
        Returns: number
      }
      soft_delete_infracao_mais_vanta: {
        Args: { p_id: string }
        Returns: boolean
      }
      soft_delete_lote: { Args: { p_id: string }; Returns: boolean }
      soft_delete_lotes_by_ids: { Args: { p_ids: string[] }; Returns: number }
      soft_delete_mais_vanta_config_evento: {
        Args: { p_id: string }
        Returns: boolean
      }
      soft_delete_mesa: { Args: { p_id: string }; Returns: boolean }
      soft_delete_notification: { Args: { p_id: string }; Returns: boolean }
      soft_delete_push_subscription_by_endpoint: {
        Args: { p_endpoint: string }
        Returns: boolean
      }
      soft_delete_push_subscriptions_self: { Args: never; Returns: number }
      soft_delete_push_template: { Args: { p_id: string }; Returns: boolean }
      soft_delete_site_content: { Args: { p_key: string }; Returns: boolean }
      soft_delete_vanta_indica: { Args: { p_id: string }; Returns: boolean }
      soft_delete_variacao_ingresso: {
        Args: { p_id: string }
        Returns: boolean
      }
      soft_delete_variacoes_by_ids: {
        Args: { p_ids: string[] }
        Returns: number
      }
      soft_delete_variacoes_by_lotes: {
        Args: { p_lote_ids: string[] }
        Returns: number
      }
      top_vendidos_24h: {
        Args: { p_cidade: string; p_limit?: number }
        Returns: {
          evento_id: string
          total_vendas: number
        }[]
      }
      transferir_ingresso: {
        Args: {
          p_data_evento?: string
          p_destinatario_id: string
          p_destinatario_nome: string
          p_evento_id: string
          p_evento_imagem?: string
          p_evento_local?: string
          p_remetente_id: string
          p_remetente_nome: string
          p_ticket_id: string
          p_titulo_evento?: string
          p_variacao_label?: string
        }
        Returns: string
      }
      update_connect_status: {
        Args: {
          p_account_id: string
          p_charges_enabled: boolean
          p_payouts_enabled: boolean
          p_status: string
        }
        Returns: Json
      }
      user_profile_update: { Args: { p_fields: Json }; Returns: Json }
      user_shares_tenant: {
        Args: { p_tenant_id: string; p_tenant_type: string; p_user_id: string }
        Returns: boolean
      }
      usuario_tem_desconto_mv_elegivel: {
        Args: { p_evento_id: string; p_user_id: string }
        Returns: boolean
      }
      validar_consistencia_permissoes: {
        Args: never
        Returns: {
          detalhe: string
          problema: string
          user_id: string
        }[]
      }
      validar_e_usar_cupom: {
        Args: { p_codigo: string; p_evento_id: string }
        Returns: Json
      }
      validar_username: {
        Args: { p_user_id?: string; p_username: string }
        Returns: Json
      }
      vanta_require_admin: {
        Args: { p_comunidade_id?: string }
        Returns: string
      }
      vanta_require_auth: { Args: never; Returns: string }
      vanta_require_not_impersonation: { Args: never; Returns: undefined }
      vanta_require_self_or_admin: {
        Args: { p_target_user_id: string }
        Returns: string
      }
      verificar_virada_lote: {
        Args: { p_evento_id: string }
        Returns: undefined
      }
      verify_ticket_token: { Args: { p_token: string }; Returns: string }
      vitrine_seed_eventos: { Args: never; Returns: string }
    }
    Enums: {
      area_ingresso: "VIP" | "PISTA" | "CAMAROTE" | "BACKSTAGE" | "OUTRO"
      conta_vanta:
        | "vanta_guest"
        | "vanta_member"
        | "vanta_masteradm"
        | "vanta_produtor"
        | "vanta_socio"
        | "vanta_portaria"
        | "vanta_caixa"
        | "vanta_financeiro"
        | "vanta_gerente"
        | "vanta_promoter"
      genero_ingresso: "MASCULINO" | "FEMININO" | "UNISEX"
      membro_status: "PENDENTE" | "APROVADO" | "REJEITADO"
      papel_equipe:
        | "SOCIO"
        | "PROMOTER"
        | "PORTARIA"
        | "HOST"
        | "STAFF"
        | "CAIXA"
      pix_tipo: "CPF" | "CNPJ" | "EMAIL" | "TELEFONE" | "CHAVE_ALEATORIA"
      saque_status: "PENDENTE" | "CONCLUIDO" | "ESTORNADO"
      ticket_status: "DISPONIVEL" | "USADO" | "CANCELADO"
      tipo_cargo: "PRODUTOR" | "HOST" | "PORTARIA" | "STAFF" | "CAIXA"
      transaction_status: "PENDENTE" | "CONCLUIDO" | "ESTORNADO"
      transaction_tipo: "VENDA_CAIXA" | "VENDA_CHECKOUT" | "CORTESIA"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      area_ingresso: ["VIP", "PISTA", "CAMAROTE", "BACKSTAGE", "OUTRO"],
      conta_vanta: [
        "vanta_guest",
        "vanta_member",
        "vanta_masteradm",
        "vanta_produtor",
        "vanta_socio",
        "vanta_portaria",
        "vanta_caixa",
        "vanta_financeiro",
        "vanta_gerente",
        "vanta_promoter",
      ],
      genero_ingresso: ["MASCULINO", "FEMININO", "UNISEX"],
      membro_status: ["PENDENTE", "APROVADO", "REJEITADO"],
      papel_equipe: ["SOCIO", "PROMOTER", "PORTARIA", "HOST", "STAFF", "CAIXA"],
      pix_tipo: ["CPF", "CNPJ", "EMAIL", "TELEFONE", "CHAVE_ALEATORIA"],
      saque_status: ["PENDENTE", "CONCLUIDO", "ESTORNADO"],
      ticket_status: ["DISPONIVEL", "USADO", "CANCELADO"],
      tipo_cargo: ["PRODUTOR", "HOST", "PORTARIA", "STAFF", "CAIXA"],
      transaction_status: ["PENDENTE", "CONCLUIDO", "ESTORNADO"],
      transaction_tipo: ["VENDA_CAIXA", "VENDA_CHECKOUT", "CORTESIA"],
    },
  },
} as const

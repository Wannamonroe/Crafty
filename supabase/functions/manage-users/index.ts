import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Manejo de CORS preflight (requerido por los navegadores)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Obtener la sesión del que hace la petición
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing authorization header')

    // Creamos cliente normal para verificar al usuario actual
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Validar quién es el usuario
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('No autorizado')

    // Validar si ese usuario *realmente* tiene rol de superadmin en la BBDD
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'superadmin') {
      throw new Error('Prohibido: Solo los Superadmins pueden gestionar usuarios.')
    }

    // 2. Ahora que sabemos que es seguro, instanciamos el cliente ADMIN
    // (Este cliente puede saltarse el RLS y hacer de todo)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Extraer datos de la petición (POST)
    const { action, id, email, password, role } = await req.json()

    let result = {}

    // Lógica del enrutador de Edge Function
    switch (action) {
      case 'list_users':
        const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers()
        if (listError) throw listError

        // Extraemos todos los perfiles de golpe
        const { data: profilesData } = await supabaseAdmin.from('profiles').select('id, role')

        // Mezclamos auth.users con su respectivo rol de public.profiles
        const mergedUsers = usersData.users.map(u => {
          const p = profilesData?.find(profile => profile.id === u.id)
          return {
            id: u.id,
            email: u.email,
            created_at: u.created_at,
            role: p?.role || 'sin acceso'
          }
        })

        result = { users: mergedUsers }
        break

      case 'create_user':
        // Creamos usuario en auth.users
        const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true // Confirmado automáticamente
        })
        if (createError) throw createError

        // Su Trigger (tu setup.sql) habrá creado el perfil en local como 'sin acceso'.
        // Aquí lo machacamos imponiendo el rol que nos hayan pasado en `role` si aplica
        if (role) {
          // Un update rápido para asignar el rol correcto
          await supabaseAdmin.from('profiles').update({ role }).eq('id', createdUser.user.id)
        }

        result = { user: createdUser.user }
        break

      case 'update_user':
        // Si nos pasan contraseña, la actualizamos
        if (password) {
          const { error: passError } = await supabaseAdmin.auth.admin.updateUserById(id, { password })
          if (passError) throw passError
        }
        // Siempre intentamos actualizar el rol
        if (role) {
          const { error: roleError } = await supabaseAdmin.from('profiles').update({ role }).eq('id', id)
          if (roleError) throw roleError
        }

        result = { success: true }
        break

      case 'delete_user':
        // Borramos primero al usuario en auth.users (Borra la cuenta por completo del sistema)
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(id)
        if (deleteError) throw deleteError
        // Nota: en Supabase borrar de auth.users borra de profiles por CASCADE según esté configurado tu proyecto,
        // pero por si acaso podríamos forzar el borrado de la línea. Normalmente no hace falta.
        result = { success: true }
        break

      default:
        throw new Error('Acción desconocida: ' + action)
    }

    // Retorna la respuesta
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("==== GRAVE ERROR DETECTADO ====");
    console.error(error.message);
    console.error("===============================");

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200, // CAMBIO: Devolver 200 para que Supabase-js no nos oculte la respuesta
    })
  }
})

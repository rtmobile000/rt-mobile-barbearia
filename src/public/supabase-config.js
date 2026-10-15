// Configuração oficial do Supabase para o projeto NAVALHA
const SUPABASE_URL = 'https://ankjqxbtkzccceppmbac.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_00TDDk0zii-bm6vmu-PWiW_3LgIc...'; // Cole a chave completa aqui

// Inicializa o cliente do Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função para verificar o status da assinatura (Trial de 7 dias ou Ativo/Vitalício)
async function checkSubscription(barbershopId) {
    const { data, error } = await supabaseClient
        .from('barbershops')
        .select('*')
        .eq('id', barbershopId)
        .single();

    if (error) {
        console.error('Erro ao verificar assinatura:', error);
        return true; // Mantém liberado em caso de erro de rede temporário
    }

    if (data.subscription_status === 'lifetime' || data.subscription_status === 'active') {
        return true;
    }

    if (data.subscription_status === 'trial') {
        const now = new Date();
        const trialEnd = new Date(data.trial_ends_at);
        if (now <= trialEnd) {
            return true;
        }
    }

    return false; // Retorna falso se expirou, disparando o bloqueio
}
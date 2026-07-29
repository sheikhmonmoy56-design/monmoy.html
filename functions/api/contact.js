export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const { name, email, subject, message } = data;

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ success: false, error: 'All fields required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const msgObj = {
      id: Date.now(),
      name,
      email,
      subject,
      message,
      created_at: new Date().toISOString()
    };

    if (context.env && context.env.PORTFOLIO_DB) {
      const existing = await context.env.PORTFOLIO_DB.get('messages', { type: 'json' }) || [];
      existing.unshift(msgObj);
      await context.env.PORTFOLIO_DB.put('messages', JSON.stringify(existing));
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Message saved successfully!',
      id: msgObj.id
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

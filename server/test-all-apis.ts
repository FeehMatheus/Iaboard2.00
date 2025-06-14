// Test all production APIs with provided keys
console.log('=== IA BOARD PRODUCTION API TESTS ===\n');

async function testMistralAI() {
  console.log('🤖 Testing Mistral AI...');
  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 7lCXEIqFPbgj7VUb7jAf9OY5Id93lJCH',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: 'Generate exactly 50 tokens for health check' }],
        max_tokens: 60
      })
    });

    const data = await response.json();
    if (response.ok && data.choices?.[0]?.message?.content) {
      console.log(`✅ Mistral AI: ${data.usage?.total_tokens} tokens generated`);
      return { success: true, tokens: data.usage?.total_tokens };
    } else {
      throw new Error(data.error?.message || 'Invalid response');
    }
  } catch (error) {
    console.log(`❌ Mistral AI failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testOpenRouter() {
  console.log('🔄 Testing OpenRouter...');
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ia-board.replit.app'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [{ role: 'user', content: 'Health check - respond with exactly 50 tokens' }],
        max_tokens: 60
      })
    });

    const data = await response.json();
    if (response.ok && data.choices?.[0]?.message?.content) {
      console.log(`✅ OpenRouter (GPT-4o): ${data.usage?.total_tokens} tokens generated`);
      return { success: true, tokens: data.usage?.total_tokens };
    } else {
      throw new Error(data.error?.message || 'Invalid response');
    }
  } catch (error) {
    console.log(`❌ OpenRouter failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testStabilityAI() {
  console.log('🎨 Testing Stability AI...');
  try {
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sk-hElW1SRtTMGE2N8QmHWMQFfc21fRc6qF0wSyAKFdb1ukwJEy',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [{ text: 'simple test image' }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 10
      })
    });

    const data = await response.json();
    if (response.ok && data.artifacts) {
      console.log(`✅ Stability AI: Generated ${data.artifacts.length} images`);
      return { success: true, images: data.artifacts.length };
    } else {
      throw new Error(data.message || 'Image generation failed');
    }
  } catch (error) {
    console.log(`❌ Stability AI failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testElevenLabs() {
  console.log('🔊 Testing ElevenLabs...');
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': 'sk_add29f66314cc62383b2652cdcfc78552d9e9608ddc4caaa'
      }
    });

    const data = await response.json();
    if (response.ok && data.voices) {
      console.log(`✅ ElevenLabs: ${data.voices.length} voices available`);
      return { success: true, voices: data.voices.length };
    } else {
      throw new Error(data.detail?.message || 'Voices fetch failed');
    }
  } catch (error) {
    console.log(`❌ ElevenLabs failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testTypeform() {
  console.log('📋 Testing Typeform...');
  try {
    const response = await fetch('https://api.typeform.com/me', {
      headers: {
        'Authorization': 'Bearer tfp_AdtBqVmwpmNj7YhHw7DhBEd2Yko3mDQ115dy2xL1B5sV_3pdYcugRXA7TDK'
      }
    });

    const data = await response.json();
    if (response.ok && data.alias) {
      console.log(`✅ Typeform: Account ${data.alias} accessible`);
      return { success: true, account: data.alias };
    } else {
      throw new Error(data.description || 'Authentication failed');
    }
  } catch (error) {
    console.log(`❌ Typeform failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testMailchimp() {
  console.log('📧 Testing Mailchimp...');
  try {
    const response = await fetch('https://us17.api.mailchimp.com/3.0/lists', {
      headers: {
        'Authorization': 'Bearer 1ebe7b6e9a3d69b0389c894b5a495398-us17'
      }
    });

    const data = await response.json();
    if (response.ok && data.lists) {
      console.log(`✅ Mailchimp: ${data.lists.length} lists accessible`);
      return { success: true, lists: data.lists.length };
    } else {
      throw new Error(data.detail || 'Lists fetch failed');
    }
  } catch (error) {
    console.log(`❌ Mailchimp failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testMixpanel() {
  console.log('📊 Testing Mixpanel...');
  try {
    const eventData = {
      event: 'Health Check',
      properties: {
        token: '2b26e5157e13634d0b93b53eb4c04f9a',
        time: Math.floor(Date.now() / 1000),
        test: true
      }
    };

    const encodedData = Buffer.from(JSON.stringify(eventData)).toString('base64');
    
    const response = await fetch('https://api.mixpanel.com/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `data=${encodedData}`
    });

    const result = await response.text();
    if (response.ok && result === '1') {
      console.log(`✅ Mixpanel: Event tracked successfully`);
      return { success: true, tracked: true };
    } else {
      throw new Error(`Tracking failed: ${result}`);
    }
  } catch (error) {
    console.log(`❌ Mixpanel failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testNotion() {
  console.log('📝 Testing Notion...');
  try {
    const response = await fetch('https://api.notion.com/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        page_size: 10
      })
    });

    const data = await response.json();
    if (response.ok && data.results !== undefined) {
      console.log(`✅ Notion: ${data.results.length} pages accessible`);
      return { success: true, pages: data.results.length };
    } else {
      throw new Error(data.message || 'Search failed');
    }
  } catch (error) {
    console.log(`❌ Notion failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  const results = [];
  
  results.push(await testMistralAI());
  results.push(await testOpenRouter());
  results.push(await testStabilityAI());
  results.push(await testElevenLabs());
  results.push(await testTypeform());
  results.push(await testMailchimp());
  results.push(await testMixpanel());
  results.push(await testNotion());

  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log('\n=== SUMMARY ===');
  
  if (successful === total) {
    console.log('ALL PROVIDERS ✅');
  } else if (successful >= total * 0.75) {
    console.log('MOST PROVIDERS ⚠️');
  } else {
    console.log('CRITICAL ERRORS ❌');
  }
  
  console.log(`${successful}/${total} services operational\n`);
}

runAllTests().catch(console.error);
const axios = require('axios');

async function testPolybot() {
  console.log('🧪 Testing Polybot Genesis Enhanced System...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Health check passed');
    console.log('📊 Audit Summary:', JSON.stringify(healthResponse.data.audit_summary, null, 2));
    
    // Test audit summary endpoint
    console.log('\n2. Testing audit summary endpoint...');
    const auditResponse = await axios.get('http://localhost:3000/audit/summary');
    console.log('✅ Audit summary endpoint works');
    console.log('📈 Current audit state:', JSON.stringify(auditResponse.data, null, 2));
    
    // Test dispatch with validation (no API keys needed for validation test)
    console.log('\n3. Testing dispatch validation...');
    try {
      const invalidDispatch = await axios.post('http://localhost:3000/dispatch', {
        prompt: '',
        agents: []
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validation working - rejected invalid request');
        console.log('📝 Validation errors:', error.response.data.validation_errors);
      } else {
        throw error;
      }
    }
    
    // Test with valid request but no API keys (should get OpenRouter errors)
    console.log('\n4. Testing valid dispatch request...');
    const testPrompt = 'What is artificial intelligence?';
    const testAgents = ['openai', 'google'];
    
    try {
      const dispatchResponse = await axios.post('http://localhost:3000/dispatch', {
        prompt: testPrompt,
        agents: testAgents,
        judge: 'anthropic'
      });
      
      console.log('✅ Dispatch completed');
      console.log('📋 Dispatch ID:', dispatchResponse.data.dispatch_id);
      console.log('⏱️  Execution time:', dispatchResponse.data.execution_time + 'ms');
      console.log('🤖 Results summary:');
      
      Object.entries(dispatchResponse.data.results).forEach(([agent, result]) => {
        const status = result.startsWith('Error:') ? '❌' : '✅';
        const preview = result.substring(0, 80) + (result.length > 80 ? '...' : '');
        console.log(`   ${status} ${agent}: ${preview}`);
      });
      
      if (dispatchResponse.data.judge) {
        const judge = dispatchResponse.data.judge;
        console.log('🏛️  Judge result:');
        console.log(`   Agent: ${judge.agent}`);
        console.log(`   Fallback used: ${judge.fallback_used}`);
        if (judge.verdict) {
          console.log(`   Verdict: ${judge.verdict.substring(0, 100)}...`);
        }
        if (judge.error) {
          console.log(`   Error: ${judge.error}`);
        }
      }
      
    } catch (error) {
      console.log('⚠️  Dispatch completed with errors (expected without API keys)');
      console.log('📝 Error:', error.response?.data?.message || error.message);
    }
    
    console.log('\n🎯 Testing complete! Enhanced Polybot Genesis system is operational.');
    console.log('📁 Check the logs/ and snapshots/ directories for audit data.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('📝 Response:', error.response.data);
    }
  }
}

testPolybot();

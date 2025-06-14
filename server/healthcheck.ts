import { aiHealthCheck } from './ai-health-check';

async function runHealthCheck() {
  console.log('🔍 Starting comprehensive AI health check...\n');
  
  try {
    const result = await aiHealthCheck.runFullHealthCheck();
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('               AI HEALTH CHECK RESULTS');
    console.log('═══════════════════════════════════════════════════════\n');
    
    result.results.forEach((service, index) => {
      const status = service.success ? '✅ PASS' : '❌ FAIL';
      console.log(`${index + 1}. ${service.service}: ${status}`);
      console.log(`   Message: ${service.message}`);
      
      if (service.url) {
        console.log(`   URL: ${service.url}`);
      }
      
      if (service.details) {
        console.log(`   Details:`, JSON.stringify(service.details, null, 2));
      }
      
      console.log('');
    });
    
    console.log('═══════════════════════════════════════════════════════');
    console.log(`OVERALL RESULT: ${result.success ? '✅ ALL SYSTEMS OPERATIONAL' : '❌ SOME SYSTEMS FAILED'}`);
    console.log('═══════════════════════════════════════════════════════');
    
    process.exit(result.success ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
    process.exit(1);
  }
}

runHealthCheck();
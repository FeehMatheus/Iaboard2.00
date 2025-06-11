import { storage } from './storage';

export async function seedDemoData() {
  try {
    console.log('🌱 Seeding demo data for infinite board...');

    // Create demo user
    const demoUser = await storage.createUser({
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@maquinamilionaria.com',
      password: 'demo123',
      plan: 'professional',
      subscriptionStatus: 'active',
      furionCredits: 5000
    });

    console.log('✅ Demo user created:', demoUser.id);

    // Create demo funnel nodes for the infinite board
    const demoNodes = [
      {
        id: `node-landing-${Date.now()}-1`,
        funnelId: null,
        userId: demoUser.id,
        title: 'Landing Page High-Convert',
        type: 'landing',
        category: 'acquisition',
        status: 'active',
        position: { x: 200, y: 150 },
        size: { width: 280, height: 200 },
        connections: [],
        content: {
          config: {
            headline: 'Transforme Suas Ideias em Lucro Real',
            subheadline: 'Sistema comprovado que já gerou R$ 50M+ para nossos clientes',
            cta: 'QUERO ACESSO AGORA'
          },
          metrics: {
            visitors: 15420,
            conversions: 2350,
            revenue: 125400,
            ctr: 15.2
          },
          assets: {
            images: ['hero-bg.jpg', 'testimonial-1.jpg'],
            videos: ['intro-video.mp4'],
            scripts: ['tracking-pixel.js']
          }
        },
        metadata: {
          created: new Date(),
          updated: new Date(),
          owner: demoUser.id,
          tags: ['high-convert', 'tested'],
          priority: 'high',
          version: '2.1.0'
        }
      },
      {
        id: `node-vsl-${Date.now()}-2`,
        funnelId: null,
        userId: demoUser.id,
        title: 'VSL Irresistível 45min',
        type: 'vsl',
        category: 'conversion',
        status: 'active',
        position: { x: 600, y: 150 },
        size: { width: 280, height: 200 },
        connections: [],
        content: {
          config: {
            duration: '45 minutes',
            script: 'Script neurocientífico testado em 50k+ leads',
            offers: ['Produto Principal R$ 1997', 'Bônus Exclusivos R$ 2500']
          },
          metrics: {
            visitors: 8750,
            conversions: 1244,
            revenue: 248800,
            ctr: 14.2
          },
          assets: {
            videos: ['vsl-master.mp4'],
            scripts: ['vsl-analytics.js']
          }
        },
        metadata: {
          created: new Date(),
          updated: new Date(),
          owner: demoUser.id,
          tags: ['vsl', 'neuro-marketing'],
          priority: 'high',
          version: '3.0.0'
        }
      },
      {
        id: `node-checkout-${Date.now()}-3`,
        funnelId: null,
        userId: demoUser.id,
        title: 'Checkout Otimizado',
        type: 'checkout',
        category: 'monetization',
        status: 'active',
        position: { x: 1000, y: 150 },
        size: { width: 280, height: 200 },
        connections: [],
        content: {
          config: {
            paymentMethods: ['PIX', 'Cartão', 'Boleto'],
            installments: 12,
            guaranteeDays: 30
          },
          metrics: {
            visitors: 1244,
            conversions: 746,
            revenue: 1487054,
            ctr: 59.9
          },
          assets: {
            scripts: ['payment-gateway.js', 'fraud-detection.js']
          }
        },
        metadata: {
          created: new Date(),
          updated: new Date(),
          owner: demoUser.id,
          tags: ['checkout', 'optimized'],
          priority: 'critical',
          version: '1.5.0'
        }
      },
      {
        id: `node-traffic-${Date.now()}-4`,
        funnelId: null,
        userId: demoUser.id,
        title: 'Tráfego Facebook Ads',
        type: 'traffic',
        category: 'acquisition',
        status: 'active',
        position: { x: 200, y: 400 },
        size: { width: 280, height: 200 },
        connections: [],
        content: {
          config: {
            budget: 'R$ 500/dia',
            targetAudience: 'Empreendedores 25-45 anos',
            adFormats: ['Video', 'Carousel', 'Single Image']
          },
          metrics: {
            visitors: 25600,
            conversions: 3840,
            revenue: 76800,
            ctr: 3.2,
            cost: 15000
          },
          assets: {
            images: ['ad-creative-1.jpg', 'ad-creative-2.jpg'],
            videos: ['ad-video.mp4']
          }
        },
        metadata: {
          created: new Date(),
          updated: new Date(),
          owner: demoUser.id,
          tags: ['facebook-ads', 'scaling'],
          priority: 'high',
          version: '1.2.0'
        }
      },
      {
        id: `node-email-${Date.now()}-5`,
        funnelId: null,
        userId: demoUser.id,
        title: 'Sequência Email 7 Dias',
        type: 'email',
        category: 'retention',
        status: 'active',
        position: { x: 600, y: 400 },
        size: { width: 280, height: 200 },
        connections: [],
        content: {
          config: {
            emailCount: 7,
            sequence: 'Aquecimento + Venda + Urgência',
            openRate: '45.2%',
            clickRate: '12.8%'
          },
          metrics: {
            visitors: 15420,
            conversions: 1973,
            revenue: 394600,
            ctr: 12.8
          },
          assets: {
            scripts: ['email-tracking.js']
          }
        },
        metadata: {
          created: new Date(),
          updated: new Date(),
          owner: demoUser.id,
          tags: ['email-marketing', 'automation'],
          priority: 'medium',
          version: '2.0.0'
        }
      },
      {
        id: `node-analytics-${Date.now()}-6`,
        funnelId: null,
        userId: demoUser.id,
        title: 'Analytics Dashboard',
        type: 'analytics',
        category: 'retention',
        status: 'active',
        position: { x: 1000, y: 400 },
        size: { width: 280, height: 200 },
        connections: [],
        content: {
          config: {
            metrics: ['ROI', 'LTV', 'CAC', 'Churn Rate'],
            dashboards: 3,
            realTime: true
          },
          metrics: {
            visitors: 0,
            conversions: 0,
            revenue: 0,
            ctr: 0
          },
          assets: {
            scripts: ['analytics-tracker.js', 'conversion-pixel.js']
          }
        },
        metadata: {
          created: new Date(),
          updated: new Date(),
          owner: demoUser.id,
          tags: ['analytics', 'tracking'],
          priority: 'medium',
          version: '1.0.0'
        }
      }
    ];

    // Create funnel nodes
    for (const nodeData of demoNodes) {
      await storage.createFunnelNode(nodeData);
      console.log(`✅ Created node: ${nodeData.title}`);
    }

    // Create demo analytics data
    const analyticsEvents = [
      { event: 'view', nodeId: demoNodes[0].id, value: null },
      { event: 'click', nodeId: demoNodes[0].id, value: null },
      { event: 'conversion', nodeId: demoNodes[1].id, value: '1997' },
      { event: 'purchase', nodeId: demoNodes[2].id, value: '1997' },
      { event: 'view', nodeId: demoNodes[3].id, value: null },
      { event: 'click', nodeId: demoNodes[4].id, value: null }
    ];

    for (const event of analyticsEvents) {
      await storage.createFunnelAnalytics({
        funnelId: null,
        nodeId: event.nodeId,
        userId: demoUser.id,
        event: event.event,
        sessionId: `session-${Date.now()}-${Math.random()}`,
        userAgent: 'Demo Browser',
        referrer: 'https://demo.example.com',
        data: { demo: true },
        value: event.value
      });
    }

    console.log('✅ Demo analytics data created');

    // Create demo canvas state
    await storage.saveCanvasState(demoUser.id, {
      viewport: { zoom: 1, pan: { x: 0, y: 0 } },
      selectedNodes: [],
      gridSettings: { size: 50, visible: true, snap: true },
      minimapSettings: { visible: true, position: 'bottom-right' },
      boardSettings: { theme: 'dark', animations: true }
    });

    console.log('✅ Demo canvas state saved');
    console.log('🎉 Demo data seeding completed successfully!');

    return demoUser;
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    throw error;
  }
}
# IA Board - AI-Powered Visual Funnel Builder

## Overview

IA Board is a sophisticated AI-powered visual funnel builder that enables users to create complete sales funnels through an infinite canvas interface. The platform integrates multiple AI providers (OpenAI, Claude, Gemini, Mistral) and specialized services to automate the creation of marketing materials, videos, copywriting, and traffic campaigns. Users can build interconnected AI-powered modules on a visual canvas, with each module performing specific tasks like product creation, video generation, copywriting, and campaign management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: TailwindCSS with shadcn/ui components for consistent design
- **Canvas System**: ReactFlow-based infinite canvas with zoom, pan, and drag-and-drop functionality
- **State Management**: React hooks with local storage persistence
- **Component Structure**: Modular design with reusable UI components from Radix UI

### Backend Architecture
- **Server**: Express.js with TypeScript in ESM format
- **Database**: PostgreSQL with Drizzle ORM for schema management
- **API Design**: RESTful endpoints with proper error handling and validation
- **Multi-Provider AI System**: Smart routing between different AI providers with fallback mechanisms
- **File Management**: Organized storage system for generated content (videos, audio, documents)

### AI Integration Layer
The system implements a "Smart LLM" approach that dynamically routes requests between multiple AI providers:
- **Primary Providers**: OpenRouter (multi-model access), Mistral AI, Stability AI
- **Fallback Strategy**: Automatic failover between providers based on availability and quota
- **Specialized Services**: ElevenLabs for text-to-speech, HeyGen for avatar videos, Typeform for dynamic forms
- **Content Generation**: Each AI module specializes in specific tasks (copywriting, video generation, traffic campaigns)

### Canvas and Module System
- **Infinite Canvas**: Built with ReactFlow for smooth zooming, panning, and node manipulation
- **Module Types**: Specialized AI blocks for different functions (copy generation, video creation, traffic campaigns, product development)
- **Connection System**: Visual connections between modules with animated links
- **Export Capabilities**: Multiple export formats (JSON, PDF, Markdown) for complete funnel documentation

### Authentication and Data Persistence
- **User System**: Simple authentication with project management
- **Data Storage**: PostgreSQL for user data and project persistence
- **Content Storage**: File system organization for generated assets
- **Backup System**: JSON export functionality for project portability

## External Dependencies

### AI and ML Services
- **OpenRouter API**: Multi-model access (GPT-4, Claude, Gemini) with unified interface
- **Mistral AI**: Large language model for specialized copywriting and strategy tasks
- **Stability AI**: Image and video generation using Stable Diffusion models
- **ElevenLabs**: High-quality text-to-speech synthesis with multiple voice options
- **HeyGen**: AI avatar video generation for personalized content

### Business and Automation Tools
- **Typeform**: Dynamic form creation and lead capture
- **Mailchimp**: Email marketing automation and subscriber management
- **Mixpanel**: Analytics and user behavior tracking
- **Notion**: Document storage and knowledge base integration
- **Zapier**: Workflow automation and third-party integrations

### Development and Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle Kit**: Database migrations and schema management
- **Stripe**: Payment processing for subscription plans
- **Vite**: Fast development build tool
- **Various UI Libraries**: Radix UI, React Hook Form, TanStack Query for enhanced functionality

### Content and Media Processing
- **File Storage**: Local file system with organized directory structure
- **Media Processing**: Support for MP3 audio, MP4 video, and PDF document generation
- **Image Handling**: Integration with AI image generation and processing services
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../../ui/card';
import { CardList } from './CardList';

const meta: Meta<typeof CardList> = {
  title: 'sewdn/CardList',
  component: CardList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div className="min-h-screen w-full min-w-0 bg-background p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CardList>;

interface ProjectCard {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'archived';
}

const sampleProjects: ProjectCard[] = [
  {
    id: '1',
    title: 'Project Alpha',
    description: 'A cutting-edge web application',
    status: 'active',
  },
  {
    id: '2',
    title: 'Project Beta',
    description: 'Mobile-first responsive design',
    status: 'active',
  },
  {
    id: '3',
    title: 'Project Gamma',
    description: 'Enterprise-level solution',
    status: 'archived',
  },
  {
    id: '4',
    title: 'Project Delta',
    description: 'AI-powered analytics platform',
    status: 'active',
  },
];

export const Default: Story = {
  render: () => (
    <CardList items={sampleProjects}>
      {project => (
        <Card key={project.id} className="p-4">
          <h3 className="font-semibold">{project.title}</h3>
          <p className="text-sm text-muted-foreground">{project.description}</p>
          <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
            {project.status}
          </span>
        </Card>
      )}
    </CardList>
  ),
};

export const Empty: Story = {
  render: () => (
    <CardList
      items={[]}
      emptyChildren={
        <div className="col-span-full text-center text-muted-foreground">
          No projects found. Create a new project to get started.
        </div>
      }
    >
      {_p => {
        return <div>Hello</div>;
      }}
    </CardList>
  ),
};

export const WithExtraContent: Story = {
  render: () => (
    <CardList
      items={sampleProjects}
      extraChildren={
        <Card className="p-4 border-dashed">
          <div className="flex h-full items-center justify-center">
            <button className="text-sm text-muted-foreground hover:text-primary">
              + Add New Project
            </button>
          </div>
        </Card>
      }
    >
      {project => (
        <Card key={project.id} className="p-4">
          <h3 className="font-semibold">{project.title}</h3>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </Card>
      )}
    </CardList>
  ),
};

export const DifferentGridSizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-sm font-medium">Grid Size: 12 (1 column)</h3>
        <CardList items={sampleProjects.slice(0, 1)} gridSize={12}>
          {project => (
            <Card key={project.id} className="p-4">
              <h3 className="font-semibold">{project.title}</h3>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </Card>
          )}
        </CardList>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium">Grid Size: 6 (2 columns)</h3>
        <CardList items={sampleProjects.slice(0, 2)} gridSize={6}>
          {project => (
            <Card key={project.id} className="p-4">
              <h3 className="font-semibold">{project.title}</h3>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </Card>
          )}
        </CardList>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium">Grid Size: 4 (3 columns)</h3>
        <CardList items={sampleProjects.slice(0, 3)} gridSize={4}>
          {project => (
            <Card key={project.id} className="p-4">
              <h3 className="font-semibold">{project.title}</h3>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </Card>
          )}
        </CardList>
      </div>
    </div>
  ),
};

export const ResponsiveLayout: Story = {
  render: () => (
    <CardList items={sampleProjects}>
      {project => (
        <Card key={project.id} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{project.title}</h3>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
              {project.status}
            </span>
          </div>
        </Card>
      )}
    </CardList>
  ),
};

import { TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTabNavBarHarness } from '@angular/material/tabs/testing';
import { provideRouter, Router } from '@angular/router';
import { Layout } from './layout.component';
import { routes } from '../app.routes';
import { ExamSession } from '../features/exam/exam-session.service';
import { TermService } from '../term/term.service';

describe('Layout', () => {
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    loader = TestbedHarnessEnvironment.loader(TestBed.createComponent(Layout));
  });

  async function navigateTo(url: string) {
    await TestBed.inject(Router).navigateByUrl(url);
    return loader.getHarness(MatTabNavBarHarness);
  }

  it('links the three sections in order', async () => {
    const navBar = await navigateTo('/');
    const labels = await Promise.all((await navBar.getLinks()).map(link => link.getLabel()));

    expect(labels).toEqual(['Erfassen', 'Trainieren', 'Prüfung']);
  });

  it('opens Erfassen by default', async () => {
    const navBar = await navigateTo('/');

    expect(await (await navBar.getActiveLink()).getLabel()).toBe('Erfassen');
  });

  it('marks the section of the current route as active', async () => {
    const navBar = await navigateTo('/exam');

    expect(await (await navBar.getActiveLink()).getLabel()).toBe('Prüfung');
  });

  it('locks Erfassen and Trainieren and stays on Prüfung while an exam runs', async () => {
    TestBed.inject(TermService).add({ source: 'Haus', target: 'house' });
    TestBed.inject(ExamSession).start({ limit: 1, passRate: 80 });

    const navBar = await navigateTo('/vocabulary');
    const links = await navBar.getLinks();
    const disabled = await Promise.all(links.map(link => link.isDisabled()));

    expect(disabled).toEqual([true, true, false]);
    expect(await (await navBar.getActiveLink()).getLabel()).toBe('Prüfung');
  });
});

import re

def process_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Change all themes to theme-dark
    content = re.sub(r'class="slide theme-(light|rose)(.*?)"', r'class="slide theme-dark\2"', content)

    # Add custom CSS link right before </head> if not already there
    custom_css = '<link rel="stylesheet" href="assets/custom.css">\n</head>'
    if 'custom.css' not in content:
        content = content.replace('</head>', custom_css)

    # 2. Slide 3 (Проблема)
    slide_3_new = '''<div class="asymmetric-layout">
          <div class="roadmap-layout" style="grid-template-columns: 1fr; gap: 1rem;">
            <div class="roadmap-intro">
              <div class="roadmap-copy">
                <h2>Почему вокруг ИИ столько шума и путаницы</h2>
              </div>
            </div>
            <div class="roadmap-track">
              <article class="roadmap-item tone-soft">
                <span class="roadmap-node" aria-hidden="true"></span>
                <div class="roadmap-card">
                  <div class="roadmap-item-copy">
                    <p>Интерфейс похож, а механика внутри разная.</p>
                  </div>
                </div>
              </article>
              <article class="roadmap-item tone-rose">
                <span class="roadmap-node" aria-hidden="true"></span>
                <div class="roadmap-card">
                  <div class="roadmap-item-copy">
                    <p>Обычный чат и search-система решают разные типы задач.</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
          <div class="visual-placeholder">
            <span>[ Здесь должна быть абстрактная 3D-сцена: лабиринт из нейросетей, символизирующая запутанность и шум ]</span>
          </div>
        </div>'''
    content = re.sub(r'(<section class="slide theme-dark" id="slide-3".*?<div class="slide-shell[^>]*>).*?(</section>)', 
                     lambda m: m.group(1) + f'\n        <div class="slide-index">02</div>\n        {slide_3_new}\n      </div>\n    </section>', 
                     content, flags=re.DOTALL)

    # 3. Slide 5 (Разговорные) - Inject visual placeholder
    s5_placeholder = '''
        <div class="asymmetric-layout">
          <div class="type-body convo-layout" style="grid-template-columns: 1fr;">
            <article class="type-panel convo-strong type-panel-teal">
              <span class="type-eyebrow">Сильные стороны</span>
              <h3>Хороши как быстрый умный собеседник</h3>
              <ul class="type-list">
                <li>объясняют сложное простыми словами</li>
                <li>пишут, переписывают и переводят тексты</li>
              </ul>
            </article>
            <article class="type-panel convo-limits type-panel-rose">
              <span class="type-eyebrow">Слабые стороны</span>
              <h3>Слабы там, где нужен факт, а не формулировка</h3>
            </article>
            <article class="type-panel convo-use">
              <span class="type-eyebrow">Когда использовать</span>
              <div class="decision-tags good-tags">
                <span>объяснить тему</span><span>сделать summary</span>
              </div>
            </article>
          </div>
          <div class="visual-placeholder">
            <span>[ Визуал: Голографические текстовые пузыри чата, перетекающие в структуру документа ]</span>
          </div>
        </div>
'''
    # We replace the type-body of slide-5
    content = re.sub(r'(<section class="slide theme-dark" id="slide-5".*?<div class="type-head">.*?</div>).*?(</section>)',
                     lambda m: m.group(1) + s5_placeholder + '      </div>\n    ' + m.group(2), content, flags=re.DOTALL)

    # 4. Slide 11 (Мультимодальность) - Use tool-spectrum.svg
    content = re.sub(r'(<section class="slide theme-dark" id="slide-11".*?<div class="type-head">.*?</div>).*?(</section>)',
                     lambda m: m.group(1) + '''
        <div class="asymmetric-layout-reverse">
          <div class="visual-placeholder" style="padding:0; border:none; background:transparent;">
            <img src="assets/visuals/tool-spectrum.svg" alt="Tool Spectrum" style="object-fit: contain; position: relative;">
          </div>
          <div class="type-body">
            <article class="type-panel omni-idea type-panel-dark">
              <span class="type-eyebrow">Что происходит</span>
              <h3>Пользователь видит один продукт, но внутри работает несколько режимов</h3>
              <p class="type-blurb">Один и тот же интерфейс может сначала ответить как чат, потом сходить в поиск...</p>
            </article>
            <article class="type-panel omni-when type-panel-teal">
              <span class="type-eyebrow">Почему это важно</span>
              <ul class="type-list">
                <li>вы выбираете набор режимов внутри продукта</li>
                <li>ограничения и риски меняются от режима к режиму</li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    ''' + m.group(2), content, flags=re.DOTALL)

    # 5. Slide 12 (Экосистемы) - Use ai-landscape.svg
    content = re.sub(r'(<section class="slide theme-dark" id="slide-12".*?<div class="section-head">.*?</div>).*?(</section>)',
                     lambda m: m.group(1) + '''
        <div class="asymmetric-layout">
          <div class="eco-grid" style="grid-template-columns: 1fr; gap: 0.8rem;">
            <article class="eco-card" style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem;">
              <h3>Глобальные</h3>
              <div class="chip-set"><span>ChatGPT</span><span>Claude</span><span>Gemini</span></div>
            </article>
            <article class="eco-card" style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem;">
              <h3>Россия</h3>
              <div class="chip-set"><span>GigaChat</span><span>YandexGPT</span></div>
            </article>
            <article class="eco-card" style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem;">
              <h3>Китай</h3>
              <div class="chip-set"><span>DeepSeek</span><span>Qwen</span></div>
            </article>
          </div>
          <div class="visual-placeholder" style="padding:0; border:none; background:transparent;">
            <img src="assets/visuals/ai-landscape.svg" alt="AI Landscape" style="object-fit: contain; position: relative;">
          </div>
        </div>
      </div>
    ''' + m.group(2), content, flags=re.DOTALL)

    # 6. Slide 16 (Безопасность) - Use security-zones.svg
    content = re.sub(r'(<section class="slide theme-dark" id="slide-16".*?<div class="section-head">.*?</div>).*?(</section>)',
                     lambda m: m.group(1) + '''
        <div class="asymmetric-layout-reverse">
          <div class="visual-placeholder" style="padding:0; border:none; background:transparent;">
            <img src="assets/visuals/security-zones.svg" alt="Security Zones" style="object-fit: contain; position: relative;">
          </div>
          <div class="safety-grid" style="grid-template-columns: 1fr; gap: 0.6rem;">
            <article class="safety-band band-ok" style="border-radius: 1rem;">
              <h3>Можно</h3><ul><li>публичные материалы</li><li>обезличенные примеры</li></ul>
            </article>
            <article class="safety-band band-care" style="border-radius: 1rem;">
              <h3>Осторожно</h3><ul><li>внутренние черновики</li><li>рабочие заметки</li></ul>
            </article>
            <article class="safety-band band-stop" style="border-radius: 1rem;">
              <h3>Нельзя по умолчанию</h3><ul><li>персональные данные</li><li>ключи, токены</li></ul>
            </article>
          </div>
        </div>
      </div>
    ''' + m.group(2), content, flags=re.DOTALL)

    # 7. Slide 18 (Retention) - Use retention-cycle.svg
    content = re.sub(r'(<section class="slide theme-dark" id="slide-18".*?<div class="section-head">.*?</div>).*?(</section>)',
                     lambda m: m.group(1) + '''
        <div class="asymmetric-layout">
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="timeline-stage" style="grid-template-columns: 1fr; gap: 0.5rem; justify-items: start;">
              <div class="timeline-card" style="display: flex; gap: 1rem; align-items: center; border: 1px solid rgba(255,255,255,0.1); padding: 1rem; border-radius: 1rem; width: 100%;">
                <strong>01</strong><span>ввод</span>
              </div>
              <div class="timeline-card danger-tile" style="display: flex; gap: 1rem; align-items: center; border: 1px solid rgba(255,255,255,0.1); padding: 1rem; border-radius: 1rem; width: 100%;">
                <strong>04</strong><span>логи и следы</span>
              </div>
            </div>
            <div class="evidence-row" style="margin-top: 1rem;">
              <span>backup</span><span>audit log</span><span>memory</span><span>admin controls</span>
            </div>
          </div>
          <div class="visual-placeholder" style="padding:0; border:none; background:transparent;">
            <img src="assets/visuals/retention-cycle.svg" alt="Retention Cycle" style="object-fit: contain; position: relative;">
          </div>
        </div>
      </div>
    ''' + m.group(2), content, flags=re.DOTALL)

    # 8. Slide 19 (Промпт) - Use prompt-stack.svg
    content = re.sub(r'(<section class="slide theme-dark" id="slide-19".*?<div class="section-grid section-grid-prompt">).*?(</section>)',
                     lambda m: m.group(1) + '''
          <div style="display: flex; flex-direction: column; justify-content: center;">
            <h2>Из чего состоит сильный промпт</h2>
            <article class="prompt-card dark-prompt-card" style="margin-top: 2rem;">
              <span class="prompt-chip">Суть</span>
              <p class="prompt-note">Промпт-инжиниринг — это не магические фразы, а проектирование запроса так, чтобы модель поняла задачу и вернула полезный результат.</p>
            </article>
          </div>
          <div class="visual-placeholder" style="padding:0; border:none; background:transparent;">
            <img src="assets/visuals/prompt-stack.svg" alt="Prompt Stack" style="object-fit: contain; position: relative;">
          </div>
        </div>
      </div>
    </section>''', content, flags=re.DOTALL)

    # 9. Slide 21 (Final) - Visual placeholder
    content = re.sub(r'(<section class="slide theme-dark final-slide" id="slide-21".*?<div class="slide-shell">).*?(</section>)',
                     lambda m: m.group(1) + '''
        <div class="slide-index">20</div>
        <div class="asymmetric-layout">
          <div class="final-grid" style="align-content: center;">
            <div>
              <h2 style="font-size: 2.8rem; line-height: 1.1;">Сильный пользователь ИИ сначала выбирает режим работы, потом проверяет контур данных, и только после этого пишет запрос.</h2>
            </div>
            <div class="hero-actions" style="margin-top: 2rem;">
              <a class="cta hero-cta-primary" href="materials/lecture.md">Развернутый доклад</a>
              <a class="cta cta-secondary hero-cta-secondary" href="materials/sources.md">Источники</a>
            </div>
          </div>
          <div class="visual-placeholder">
            <span>[ Эпичная финальная графика: Светящееся ядро нейросети, пульсирующее в темном пространстве, символизирующее ясность и мощь инструмента ]</span>
          </div>
        </div>
      </div>
    </section>''', content, flags=re.DOTALL)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    process_html("index.html")

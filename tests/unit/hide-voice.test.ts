import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/SpeakButton', () => ({ claimMandarinAudio: vi.fn() }));
import { createHideVoicePlayer } from '@/lib/use-hide-voice';

function setup() {
  const audio = {
    src: '', preload: '', playbackRate: 1, paused: true, ended: false,
    onended: null as (() => void) | null,
    onerror: null as (() => void) | null,
    onpause: null as (() => void) | null,
    play: vi.fn((): Promise<void> => { audio.paused = false; audio.ended = false; return Promise.resolve(); }),
    pause: vi.fn(() => { audio.paused = true; }),
    removeAttribute: vi.fn(), load: vi.fn(),
  };
  let owner: (() => void) | null = null;
  const claimFocus = (stop: () => void) => {
    owner?.(); owner = stop;
    return () => { if (owner === stop) owner = null; };
  };
  const onChange = vi.fn();
  const createAudio = vi.fn(() => audio as unknown as HTMLAudioElement);
  const player = createHideVoicePlayer({ onChange, createAudio, claimFocus });
  const end = () => { audio.ended = true; audio.paused = true; audio.onended?.(); };
  return { audio, player, onChange, createAudio, claimFocus, end };
}

describe('Escondites: reproducción iniciada por el alumno', () => {
  it('empieza dentro del clic y conserva el mismo elemento entre pregunta, pistas y feedback', () => {
    const { audio, player, onChange, createAudio, end } = setup();
    player.play(['/question.mp3', '/negative.mp3', '/positive.mp3']);
    expect(audio.play).toHaveBeenCalledTimes(1);
    expect(audio.src).toBe('/question.mp3');
    const oldEnd = audio.onended;
    end();
    expect(audio.src).toBe('/negative.mp3');
    oldEnd?.(); // A late event from the question must not skip the second clue.
    expect(audio.src).toBe('/negative.mp3');
    end();
    expect(audio.src).toBe('/positive.mp3');
    end();
    expect(onChange).toHaveBeenLastCalledWith({ activeSource: null, blocked: false, failed: false });
    player.play(['/correct.mp3']);
    expect(createAudio).toHaveBeenCalledTimes(1);
    expect(audio.play).toHaveBeenCalledTimes(4);
    expect(audio.src).toBe('/correct.mp3');
  });

  it('una respuesta interrumpe la pregunta y descarta sus eventos y rechazos tardíos', async () => {
    const { audio, player, onChange } = setup();
    let rejectQuestion: (reason: Error) => void = () => {};
    audio.play.mockImplementationOnce(() => new Promise<void>((_, reject) => { rejectQuestion = reject; }));
    player.play(['/question.mp3', '/clue.mp3']);
    const oldEnd = audio.onended;
    player.play(['/feedback.mp3']);
    rejectQuestion(new DOMException('Interrupted', 'AbortError'));
    oldEnd?.();
    await Promise.resolve();
    expect(audio.play).toHaveBeenCalledTimes(2);
    expect(audio.src).toBe('/feedback.mp3');
    expect(onChange).toHaveBeenLastCalledWith({ activeSource: '/feedback.mp3', blocked: false, failed: false });
  });

  it('cede el audio a una palabra pulsada y recupera el foco en la siguiente ronda', () => {
    const { audio, player, onChange, claimFocus } = setup();
    player.play(['/question.mp3', '/clue.mp3']);
    const oldEnd = audio.onended;
    const stopWord = vi.fn();
    claimFocus(stopWord);
    expect(audio.paused).toBe(true);
    expect(onChange).toHaveBeenLastCalledWith({ activeSource: null, blocked: false, failed: false });
    oldEnd?.();
    expect(audio.play).toHaveBeenCalledTimes(1);
    player.play(['/next-question.mp3']);
    expect(stopWord).toHaveBeenCalledOnce();
    expect(audio.src).toBe('/next-question.mp3');
  });

  it('permite reintentar un bloqueo y distingue un archivo inaccesible', async () => {
    const { audio, player, onChange } = setup();
    audio.play.mockRejectedValueOnce(new DOMException('Gesture required', 'NotAllowedError'));
    player.play(['/question.mp3', '/clue.mp3']);
    await Promise.resolve();
    expect(onChange).toHaveBeenLastCalledWith({ activeSource: null, blocked: true, failed: false });
    expect(audio.play).toHaveBeenCalledTimes(1);
    player.play(['/question.mp3']);
    expect(onChange).toHaveBeenLastCalledWith({ activeSource: '/question.mp3', blocked: false, failed: false });
    audio.onerror?.();
    expect(onChange).toHaveBeenLastCalledWith({ activeSource: null, blocked: false, failed: true });
  });

  it('al cerrar el juego cancela la secuencia sin actualizar un componente desmontado', () => {
    const { audio, player, onChange, claimFocus } = setup();
    player.play(['/question.mp3', '/clue.mp3']);
    const oldEnd = audio.onended;
    const oldError = audio.onerror;
    onChange.mockClear();
    player.dispose();
    oldEnd?.(); oldError?.();
    player.play(['/later.mp3']);
    claimFocus(vi.fn());
    expect(audio.paused).toBe(true);
    expect(audio.removeAttribute).toHaveBeenCalledWith('src');
    expect(audio.load).toHaveBeenCalledOnce();
    expect(audio.play).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
  });
});

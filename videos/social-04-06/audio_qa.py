"""Check completed masters and encoded audio against frozen visual schedules."""
from pathlib import Path
import json,subprocess,sys
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parent/'audio/runtime'))
import numpy as np
import soundfile as sf
records=[]
for film in ['request','profit','undo']:
    schedule=json.loads((ROOT/f'{film}-schedule.json').read_text(encoding='utf-8'))
    folder=ROOT/'audio/mixes'/film
    master,sr=sf.read(folder/'mix.wav',dtype='float32')
    aac=subprocess.run(['ffmpeg','-v','error','-i',str(folder/'mix.m4a'),'-f','f32le','-ar','48000','-ac','2','pipe:1'],capture_output=True,check=True)
    decoded=np.frombuffer(aac.stdout,dtype='<f4').reshape(-1,2)
    report=json.loads((folder/'qa.json').read_text(encoding='utf-8'))
    hits=json.loads((ROOT/f'{film}-hits.json').read_text(encoding='utf-8-sig'))
    if isinstance(hits,dict):hits=hits.get('hits',[])
    expected=round(schedule['duration']*48000)
    entry={'id':film,'expected_samples':expected,'master_samples':len(master),'sample_rate':sr,
           'channels':master.shape[1],'duration':len(master)/sr,'encoded_samples':len(decoded),
           'aac_padding_seconds':(len(decoded)-expected)/48000,
           'wav_clipped_samples':int(np.count_nonzero(np.abs(master)>=.999)),
           'aac_clipped_samples':int(np.count_nonzero(np.abs(decoded)>=.999)),
           'aac_peak_dbfs':float(20*np.log10(max(float(np.abs(decoded).max()),1e-12))),
           'integrated_lufs':float(report['loudness']['output_i']),
           'animation_hit_count':len(hits),'mixed_hit_count':len(report['hits'])}
    assert sr==48000 and master.shape[1]==2 and len(master)==expected,entry
    assert entry['wav_clipped_samples']==0 and entry['aac_clipped_samples']==0,entry
    assert abs(entry['aac_padding_seconds'])<1024/48000+.001,entry
    assert -15<=entry['integrated_lufs']<=-13,entry
    assert len(hits)==len(report['hits']),entry
    assert all(0<=x['time']<=schedule['duration'] for x in hits),entry
    records.append(entry)
(ROOT/'audio/final-mix-qa.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
print(json.dumps(records,indent=2))

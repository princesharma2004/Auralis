import json
import pandas as pd
from typing import List

df = pd.read_csv("../datasets/ResumeDataSet.csv")

jobs: List[str] = list(set(df['Category'].tolist()))

with open("../../core/jobs.json", "w") as f:
    json.dump(jobs, f)
